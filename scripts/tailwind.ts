const tailwindcss = require("tailwindcss");
const fs = require("fs");
const path = require("path");


tailwindcss({
  // optional tailwind config
})
  .process(
    `
@tailwind base;
@tailwind components;
@tailwind utilities;

`
  )
  .then(async (res) => {
    await fs.promises.writeFile(path.resolve("./public/tailwind.css"), res.css);
  });
