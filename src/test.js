function test(data){
var $scope = {};
$scope.now = Date.now();
var self = this;
var current = current;
var current = current;
var item = item;
var item = item;
var item = item;
var item = item;
var item = item;
var item = item;
var others = others;
var current = current;
var current = current;
var current = current;
var current = current;
var current = current;
var staticHost = staticHost;
var env = env;
var vtmpArr = [];
var __args_match_res = arguments.callee.toString().match(/functions+.*?((.*?))/);
var __vargs = (__args_match_res && __args_match_res[0] || "").split(/s*,s*/);
vtmpArr.push('<!DOCTYPE html>\n<html style="font-size: 40px;">\n<head>\n  <meta charset="UTF-8">\n  <title>详情</title>\n  <meta name="keywords" content="{$data["news"]["news_tags"]}}">\n  <meta name="description" content="">\n  <meta name="data-spm" content="a2h05">\n  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">\n  <meta name="format-detection" content="telephone=no,email=no">\n  <meta content="yes" name="apple-mobile-web-app-capable">\n  ');
;if (env === 'dev') {
vtmpArr.push('\n  <link rel="stylesheet" href="/css/style.css">\n  ');
} else {
vtmpArr.push('\n  <link rel="stylesheet" href="');
vtmpArr.push(typeof staticHost === "number" ? staticHost : (staticHost || ""));
vtmpArr.push('/static/css/news.min.css">\n  ');
}
vtmpArr.push('\n</head>\n<body data-spm="8253464">\n  <article class="article" data-spm="share">\n    <header class="header">\n      <h1>');
vtmpArr.push(typeof current.long_title === "number" ? current.long_title : (current.long_title || ""));
vtmpArr.push('</h1>\n      <div class="brief">\n        <span class="time">');
(function(scope){try{var args=["Y-M-D H:I:S"];args.unshift(current.publish_at);vtmpArr.push(scope.datestr.apply(scope, args));}catch(e){throw e;}}(self));
vtmpArr.push('</span>\n        <span class="author">');
vtmpArr.push(typeof current.origin === "number" ? current.origin : (current.origin || ""));
vtmpArr.push('  ');
vtmpArr.push(typeof current.news_author === "number" ? current.news_author : (current.news_author || ""));
vtmpArr.push('</span>\n        <a id="id-share" class="share" data-spm="activeshare" data-pic="http://c1-alisports-static.youku.com/logo/yksports.png?x-oss-process=image/format,jpg">分享</a>\n      </div>\n    </header>\n    <div class="content">\n      ');
vtmpArr.push(typeof current.content === "number" ? current.content : (current.content || ""));
vtmpArr.push('\n    </div>\n  </article>\n  ');
;if (others && others.length > 0) {
vtmpArr.push('\n  <section class="block referenceNews" data-spm="2418310">\n    <h2 class="block-title">相关资讯</h2>\n    <div class="block-content">\n      ');
Object.values(others).forEach(function(item){
vtmpArr.push('\n        <a href="/news/');
vtmpArr.push(typeof item.id === "number" ? item.id : (item.id || ""));
vtmpArr.push('" class="media" data-spm="d');
vtmpArr.push(typeof item.id === "number" ? item.id : (item.id || ""));
vtmpArr.push('">\n          <div class="media-left media-left-img" style="background-image:url(');
vtmpArr.push(typeof item.images_src[0] === "number" ? item.images_src[0] : (item.images_src[0] || ""));
vtmpArr.push(')"></div>\n          <div class="media-main">\n            <h5 class="title">');
vtmpArr.push(typeof item.long_title === "number" ? item.long_title : (item.long_title || ""));
vtmpArr.push('</h5>\n            <div class="desc">\n              ');
;if (item.comment_switch) {
vtmpArr.push('<span class="viewNum">');
vtmpArr.push(typeof item.comment.num === "number" ? item.comment.num : (item.comment.num || ""));
vtmpArr.push('</span>');
}
vtmpArr.push('\n              <span class="time">');
(function(scope){try{var args=["Y-M-D"];args.unshift(item.publish_time);vtmpArr.push(scope.datestr.apply(scope, args));}catch(e){throw e;}}(self));
vtmpArr.push('</span>\n            </div>\n          </div>\n        </a>\n      ');
});
vtmpArr.push('\n    </div>\n  </section>\n  ');
}
vtmpArr.push('\n  <script src="//g.alicdn.com/alilog/mlog/aplus_wap.js"></script>\n  <script src="//g.alicdn.com/alisports_frontend/sportsman_jsbridge/jsbridge.js"></script>\n  <script>\n  (function(){\n    var ua = navigator.userAgent;\n    function inBeyond() {\n      return /BeyondSports/.test(ua);\n    }\n    if (inBeyond()) {\n      var shareBtn = document.getElementById(\'id-share\');\n      shareBtn.style.display = \'inline\';\n      shareBtn.addEventListener(\'touchstart\', function(){\n        AlipayJSBridge.call(\'alisShare\', {\n          title: "');
vtmpArr.push(typeof current.long_title === "number" ? current.long_title : (current.long_title || ""));
vtmpArr.push('",\n          desc: "');
(function(scope){try{vtmpArr.push(scope.getContentStr(current.content));}catch(e){throw e;}}(self));
vtmpArr.push('",\n          preview: \'\',\n          shareUrl: location.href\n        }, function (result) {\n          // error\n        });\n      });\n    }\n  }());\n  </script>\n</body>\n</html>');
return vtmpArr.join("");

}

try {
  let str = test({
    current:{},
    others:[]
  });
} catch(e) {
  console.error('error', e)
}