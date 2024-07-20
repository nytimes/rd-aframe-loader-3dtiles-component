const { exec } = require("child_process");

const pythonScript = "convert_region_to_box.py";
const tilesetPath = "tileset.json";
const outputPath = "output_tileset.json";

exec(
  `python ${pythonScript} ${tilesetPath} ${outputPath}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  }
);
