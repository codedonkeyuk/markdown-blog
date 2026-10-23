# @markdown-blog/lib

This library does several things.

- Generates a site from a html template and markdown blog entries.
- Creates mark down blog posts which can then be used to generate an HTML blog.
- Validates both the live and dev assets

This is a typescript project that is outputted as commonjs.

## Developer instructions

### Commands

| Command            | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `npm run validate` | Uses prettier to validate project                                |
| `npm run clean`    | Applies prettier to project (can't build project unless cleaned) |
| `npm run build`    | builds the project in dist directory.                            |
| `npm run test`     | Runs the tests found in the src/code                             |
| `npm run coverage` | Runs coverage report                                             |

# Tool instructions (For website creators)

## Prerequisites

### Add Config file to you project

You need to create a `blog-config.json` file in the root of your project.

```json
{
  "siteSourcePath": "./src/site",   # your html files live here
  "postSourcePath": "./src/blog-content", # your blog posts will be generate here
  "productionPath": "./dist" # your production site will be produced here
}
```

### Copy HTML

To get started quickly on a fresh project, copy the template [../template/src/site](../template/src/site) into you project.

If you have an existing project, copy the tags found in [./assets/site/blog/page1.html](../template/src/site/blog/page1.html) & [../template/src/site/blog/post/post.html](../template/src/site/blog/post/post.html) into your project. The tags look like the following, each has a opening and close tag.

```html
<!--INJECT-META-OG-URL-START--><!--INJECT-META-OG-URL-END-->
```

### Commands available for site development

| Command                                   | Description                                                         |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `markdown-blog build`                     | builds the blog from blog entries                                   |
| `markdown-blog create "Insert Blog Name"` | creates a blog post with given name                                 |
| `markdown-blog serve`                     | serves the static site without posts, which has live reload enabled |
| `markdown-blog serve --prod`              | serves the production site with posts                               |
| `markdown-blog validate`                  | validate dev site html                                              |
| `markdown-blog validate --prod`           | validate production site html                                       |

### Serve Site

So straight out of the box; you can run the dev version of the site and modify html, css and JS straight away. Those files can be found in [./src/site](./src/site/)

```bash
  markdown-blog serve  # serve html template live, with no posts and livereload
  markdown-blog serve --prod # serve html generate site, with posts and no livereload
```

### Create a blog entry

You call the following script to create a blog entry. It will request a blog name. All blogs are prefixed with a timestamp, so multiple posts can have the same name.

```bash
markdown-blog create "Insert Blog Name"
```

Your new post can be found in [./src/blog-content](./src/blog-content).

You can then tailer your blog entry however you like. Here is a breakdown of files generated in a blog entry.

It is expected that you will have to update the images and the content in post-info.json and content.md. Here is a breakdown of these files.

| blog file         | Description                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/content.md`     | THis is markdown file where you post content lives. WImply edit using a markdown editor. Not all markdown is support, paragraphs, headings, and lists are, and code samples. Tables are not for usability reasons |
| `/post-image.svg` | The main image for the blog post, will be seen in the post and social media shares.                                                                                                                               |
| `/post-info.json` | All the information outside the post content. Creation date time, author, text used in social shares, image descriptions for accessibility                                                                        |

### Prevent publication of the post

Within your new post directory you will find a file labeled `postinfo.json`. Set it to false

```json
{
  ...
  "publish" : false,
}
```

When publish is false its ignored by the site generator.
Then when you are ready to publish change set it to `true`.

This is handy when you need time to write the blog, and create the custom images.

### Create the site

Once you are happy simply call

```bash
markdown-blog build  # builds the blog
markdown-blog serve --prod # serve html generate site, with posts and no livereload
```

You can review your changes at [http://localhost:8080](http://localhost:8080). The site injects a service worker. So you may need ot do a hard reload if you changes do not appear.
