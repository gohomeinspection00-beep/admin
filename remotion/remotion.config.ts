import fs from "fs";
import path from "path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Dalam container cloud, remotion.media disekat — guna chrome-headless-shell
// yang dah terpasang (Playwright). Di komputer sendiri, Remotion download sendiri.
const pwDir = "/opt/pw-browsers";
if (fs.existsSync(pwDir)) {
  const shellDir = fs.readdirSync(pwDir).find((d) => d.startsWith("chromium_headless_shell-"));
  if (shellDir) {
    const exe = fs
      .readdirSync(path.join(pwDir, shellDir))
      .map((sub) => path.join(pwDir, shellDir, sub, "headless_shell"))
      .find((p) => fs.existsSync(p));
    if (exe) Config.setBrowserExecutable(exe);
  }
}
