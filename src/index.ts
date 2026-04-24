import { app } from './api';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Orbit running on http://localhost:${PORT}`);
});
