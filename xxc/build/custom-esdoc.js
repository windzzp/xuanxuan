class CustomESDocPlugin {
    onStart(ev) {
        console.log(ev.data);
    }

    onHandlePlugins(ev) {
        // modify plugins
        //   ev.data.plugins = ...;
    }

    onHandleConfig(ev) {
        // modify config
        //   ev.data.config.title = ...;
    }

    onHandleCode(ev) {
        // modify code
        //   ev.data.code = ...;
    }

    onHandleCodeParser(ev) {
        // modify parser
        //   ev.data.parser = function(code){ ... };
    }

    onHandleAST(ev) {
        // modify AST
        //   ev.data.ast = ...;
    }

    onHandleDocs(ev) {
        // modify docs
        //   ev.data.docs = ...;
    }

    onPublish(ev) {
        // // write content to output dir
        // ev.data.writeFile(filePath, content);

        // // copy file to output dir
        // ev.data.copyFile(src, dest);

        // // copy dir to output dir
        // ev.data.copyDir(src, dest);

        // // read file from output dir
        // ev.data.readFile(filePath);
    }

    onHandleContent(ev) {
        // modify content
        //   ev.data.content = ...;
    }

    onComplete(ev) {
        // complete
    }
}

module.exports = new CustomESDocPlugin();
