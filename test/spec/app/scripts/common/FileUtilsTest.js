define(["jquery",
    "common/FileUtils"
], function ($, FileUtils) {
    "use strict";

    describe('FileUtils', function () {

        describe("module", function () {
            it("has trigger method", function () {
                expect(FileUtils).to.be.a("object");
                expect(FileUtils.baseName).to.be.a("function");
            });
        });

        describe('baseName()', function () {
            it('should returns the base name of the path', function () {
                expect(FileUtils.baseName("path/to/some/file.txt")).to.deep.equal("file.txt");
                expect(FileUtils.baseName("path/to/some/file.txt", ".txt")).to.deep.equal("file");
                expect(FileUtils.baseName("path/to/some/dir/")).to.deep.equal("dir");
            });
        });

        describe("imageType()", function () {
            it("Returns the image type of a data url", function () {
                expect(FileUtils.imageType('data:image/jpeg;')).to.deep.equal('JPEG');
            });
        });

        describe("extension()", function () {
            it("Returns the image type of a URI", function () {
                expect(FileUtils.extension('http://www.lolzhumor.com/Funny.gif')).to.equal('GIF');
            });
            it("Returns another url", function () {
                expect(FileUtils.extension('http://t3.gstatic.com/images?q=tbn:ANd9GcRc')).to.deep.equal('COM/IMAGES');
            });
            it("Returns invalid image url with 'image'", function () {
                expect(FileUtils.extension('http://www.google.com/url?sa=i&source=images&cd=&cad=rja')).to.deep.equal('COM/URL');
            });
        });

        // describe("createDownloadAttrs()", function() {
        //  it("Returns the image type of a data url", function() {
        //      var attrs = FileUtils.createDownloadAttrs('application/json', 'content value which is in the file', 'id.json');
        //      expect(attrs.download).to.deep.equal('id.json');
        //  });
        // });
    });
});