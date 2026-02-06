import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}

/*curl -X POST 'https://mxcntpwcspuusvzlbdri.supabase.co/auth/v1/token?grant_type=password' \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Y250cHdjc3B1dXN2emxiZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjg3MTEsImV4cCI6MjA4NDg0NDcxMX0.kYtc3SAyKu-a0GTbhbglcPG1SQNeZiqaEDJoHlxnXjk' \
-H 'Content-Type: application/json' \
-d '{
  "email": "ortizcolpaswilcardaniel@gmail.com",
  "password": "1066865142"
}'
 */

//TODO: tengo que poner lo del barer de swagger en los controlladores y el guard ver si lo dejo globla o que
