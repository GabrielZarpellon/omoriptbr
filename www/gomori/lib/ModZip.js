const AdmZip = require("../../adm-zip-0.5.1/adm-zip");

class ModZip {
    constructor(file) {
        this._zip = AdmZip(file);
    }

    exists(path) {
        return this._zip.getEntry(path) != null;
    }

    read(path) {
        if (!this.exists(path)) {
            alert(this._zip.getEntries());
            throw new Error(`Failed to read file from zip: ${path} does not exist in the archive!`);
        } else {
            return this._zip.readFile(path);
        }
    }

    write(path, data, overwrite = false) {
        if (this.exists(path) && !overwrite) {
            throw new Error(`Cannot overwrite file in zip: ${path} already exists in the archive!`);
        } else {
            this._zip.addFile(path, data, "Added by GOMORI modloader");
        }
    }

    delete(path, ignoreNotExisting = false) {
        if (!this.exists(path)) {
            if (!ignoreNotExisting) {
                throw new Error(`Cannot delete file from zip: ${path} does not exist in the archive!`)
            }
        } else {
            this._zip.deleteFile(path);
        }
    }

    writeZip() {
        return this._zip.writeZip();
    }

    getFilePaths() {
        return this._getPaths(false);
    }

    getDirPaths() {
        return this._getPaths(true);
    }

    getEntries() {
        return this._zip.getEntries();
    }

    _getPaths(directory) {
        const entries = new Set();
        this._zip.getEntries().forEach(entry => {
            if (entry.isDirectory === directory) {
                entries.add(entry.entryName);
            }
        });
        return entries;
    }
}

module.exports = ModZip;