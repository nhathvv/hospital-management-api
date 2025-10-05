import { ApiBearerAuth, DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
  .setTitle('Hospital Management API')
  .setDescription('The hospital management API description')
  .setVersion('1.0')
  .addTag('hospital-management')
  .addBearerAuth()
  .build();
export { config };