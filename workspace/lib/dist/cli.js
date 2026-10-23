#!/usr/bin/env node
import { Command } from "commander";
const program = new Command();
program
    .name("markdown-blog")
    .description("CLI tool chain to manage, build, and serve a markdown blog")
    .version("1.0.0");
program
    .command("build")
    .description("Generate the production blog files from markdown")
    .action(async () => {
    const { default: main } = await import("./blog-generation/app.js");
    await main();
});
program
    .command("create")
    .description("Create a new markdown blog post template")
    .argument("<title>", "The title of your new post")
    .action(async (title) => {
    const { default: main } = await import("./create-post/app.js");
    await main(title);
});
program
    .command("serve")
    .description("Start a local server to preview your site")
    .option("--prod", "Serve the production build instead of the development environment")
    .action(async (options) => {
    if (options.prod) {
        const { default: main } = await import("./serve-site/serve-prod.js");
        await main();
    }
    else {
        const { default: main } = await import("./serve-site/serve-dev.js");
        await main();
    }
});
program
    .command("validate")
    .description("Validate markdown files and frontmatter integrity")
    .option("--prod", "Run strict validation for production environments")
    .action(async (options) => {
    if (options.prod) {
        const { default: main } = await import("./validate/validate-prod.js");
        await main();
    }
    else {
        const { default: main } = await import("./validate/validate-dev.js");
        await main();
    }
});
program.parse();
//# sourceMappingURL=cli.js.map