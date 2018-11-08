if (typeof NodeList.prototype.forEach !== 'function') {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}

(function () {
  var langs = {
    'Home': '概览',
    'Reference': '参考',
    'References': '参考',
    'summary': '总览',
    'Manual': '文档',
    'Source': '源码',
    'Variable': '变量',
    'You can directly use an instance of this class.': '你能够直接使用这个类的实例。',
    'Example:': '示例：',
    'Directories': '目录结构',
    'Constructor Summary': '构造总览',
    'Private Constructor': '私有构造函数',
    'Public Constructor': '公共构造函数',
    'Protect Constructor': '受保护构造函数',
    'Private Constructors': '私有构造函数',
    'Public Constructors': '公共构造函数',
    'Protect Constructors': '受保护构造函数',
    'Member Summary': '成员总览',
    'Private Members': '私有成员',
    'Public Members': '公共成员',
    'Protect Members': '受保护成员',
    'Method Summary': '方法总览',
    'Private Methods': '私有方法',
    'Public Methods': '公共方法',
    'Protect Methods': '受保护方法',
    'Return:': '返回值：',
    'Params:': '参数：',
    'Static Public Summary': '静态公共成员(全局成员)总览',
    'Static Public ': '静态公共成员(全局成员)',
    'Static Private': '静态私有成员',
    'Static Method Summary': '静态方法总览',
    'Static Public Methods': '静态公共方法',
    'File': '文件',
    'Identifier': '标识',
    'Document': '文档',
    'Name': '名称',
    'Type': '类型',
    'Attribute': '属性',
    'Description': '描述',
    'Extends:': '继承：',
    'React Props:': 'React 属性：',
    'Properties:': '对象属性：',
    'See:': '了解更多：',
    'Override:': '重载',
    'Static Member Summary': '静态成员总览',
    'Static Public Members': '静态公共成员',
    'Inherited Summary': '继承的成员总览',
  };

  function translate() {
    document.querySelectorAll('body>header>a,h1,h2,h3,h4,h5,h6,thead>tr>td,.instance-docs>span,.identifier-dir-tree-header').forEach(function (element) {
      var text = element.innerHTML;
      if (langs[text] !== undefined) {
        element.innerHTML = langs[text];
      }
    });
  }

  function activeNavItem() {
    var url = window.location.href;
    var lastActiveLink;
    document.querySelectorAll('body>header>a,.navigation a').forEach(function(link) {
      var href = link.href;
      if (href.endsWith(url)) {
        link.classList.add('active');
        lastActiveLink = link;
      } else if (link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });
    if (lastActiveLink) {
      setTimeout(function() {
        lastActiveLink.scrollIntoView({behavior: 'smooth', block: 'center'});
      }, 100);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    translate();

    var origin = window.location.origin;
    document.querySelectorAll('a[href^="http"]').forEach(function(link) {
      if (link.href.indexOf(origin) < 0) {
        link.target = '_blank';
      }
    });

    document.querySelector('.search-input').setAttribute('placeholder', '搜索 API');

    activeNavItem();
    document.querySelector('.navigation').addEventListener('click', function() {
      setTimeout(activeNavItem, 100);
    });

    document.body.classList.add('ready');
  });
})();