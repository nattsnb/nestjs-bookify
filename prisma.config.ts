import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: './prisma/schema/schema.prisma',
  earlyAccess: true,
});
