import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * Gateway WebSocket para actualizaciones de asistencia en tiempo real.
 *
 * Flujo:
 * 1. El docente abre la sesión y la app Flutter se conecta al socket.
 * 2. El docente envía "join_session" con { sessionId } para suscribirse al room.
 * 3. Cuando un alumno marca asistencia, AttendancesService llama a
 *    ClassSessionsService.notifyAttendanceMarked() → emitAttendanceUpdate().
 * 4. El gateway emite "attendance_update" al room de esa sesión con la lista completa.
 * 5. La app Flutter (docente) recibe el evento y actualiza la vista inmediatamente.
 */
@WebSocketGateway({
  cors: {
    origin: '*', // Ajustar a los orígenes permitidos en producción
    credentials: true,
  },
  namespace: '/attendance',
})
export class AttendanceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AttendanceGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  /**
   * El docente se une al room de la sesión para recibir actualizaciones.
   * Payload: { sessionId: string }
   */
  @SubscribeMessage('join_session')
  async handleJoinSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `session:${data.sessionId}`;
    await client.join(room);
    this.logger.log(`Socket ${client.id} se unió al room ${room}`);
    client.emit('joined', { sessionId: data.sessionId });
  }

  /**
   * El docente abandona el room cuando cierra o sale de la sesión.
   * Payload: { sessionId: string }
   */
  @SubscribeMessage('leave_session')
  async handleLeaveSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `session:${data.sessionId}`;
    await client.leave(room);
    this.logger.log(`Socket ${client.id} abandonó el room ${room}`);
  }

  /**
   * Emite la lista actualizada de asistencias a todos los sockets en el room.
   * Llamado internamente por ClassSessionsService.
   */
  emitAttendanceUpdate(sessionId: string, records: unknown[]) {
    const room = `session:${sessionId}`;
    this.server.to(room).emit('attendance_update', {
      sessionId,
      records,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(
      `attendance_update emitido al room ${room} (${records.length} registros)`,
    );
  }
}
