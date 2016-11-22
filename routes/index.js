var fs = require('fs');
var express = require('express');
var multer = require('multer');
var csv = require('csv-string');
var router = express.Router();
var upload = multer({dest: './public/files/'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('datafile'), function(req, res, next) {
	// 获得文件的临时路径
	var tmp_path = req.file.path;
	// 指定文件上传后的目录 - 示例为"images"目录。 
	var target_path = './public/files/' + req.file.originalname;
	// 移动文件
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		// 删除临时文件夹文件, 
		fs.unlink(tmp_path, function() {
			if (err) throw err;
			res.json({ message: 'success' });
		});
	});
});

router.get('/files', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	const testFolder = './public/files/';
	fs.readdir(testFolder, (err, files) => {
		res.json({ files: files.join(', ') });
	})
});

router.get('/file', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	const fileName = req.param('filename');
	const fileType = req.param('filetype');
	fs.readFile('./public/files/' + fileName + '.' + fileType, 'utf8', (err, data) => {
		var result;
		if(fileType === 'csv') {
			result = csv.parse(data);
		} else if(fileType === 'json') {
			result = JSON.parse(data)
		}
		res.json({ file: result });
	})
});

module.exports = router;
