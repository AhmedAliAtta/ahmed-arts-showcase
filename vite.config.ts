import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // للتأكد من دعم React
import path from 'path'; // لاستخدام الـ alias

export default defineConfig({
  // base: './', // السطر القديم تم التعليق عليه
  base: '/',   // السطر الجديد الصحيح
  plugins: [react()], // الإضافة الخاصة بـ React
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // مهم علشان الـ alias @ يشتغل
    },
  },
  // other configurations... (أي إعدادات أخرى كانت موجودة تظل كما هي لو كانت تحت هذا السطر)
});
