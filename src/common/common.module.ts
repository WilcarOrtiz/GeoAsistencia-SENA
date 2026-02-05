import { Module } from '@nestjs/common';

@Module({})
export class CommonModule {}

/*{
  "user": { "role": "Editor", "id": 123 },
  "menu": [
    {
      "title": "Dashboard",
      "path": "/dashboard",
      "icon": "home_icon",
      "permission": "view_dashboard"
    },
    {
      "title": "Reportes",
      "path": "/reports",
      "icon": "bar_chart",
      "permission": "view_reports",
      "children": [
        { "title": "Ventas", "path": "/reports/sales", "permission": "view_sales_reports" }
      ]
    }
  ],
  "permissions": ["view_dashboard", "view_reports", "view_sales_reports", "edit_content", "delete_comments"]
}*/
