// 通用函数
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import { formatDate } from '/@/utils/formatTime';
import { useI18n } from 'vue-i18n';
import { parse, stringify } from 'yaml';

export default function () {
	const { t } = useI18n();
	const { toClipboard } = useClipboard();
	//百分比格式化
	const percentFormat = (row: any, column: number, cellValue: any) => {
		return cellValue ? `${cellValue}%` : '-';
	};
	//列表日期时间格式化
	const dateFormatYMD = (row: any, column: number, cellValue: any) => {
		if (!cellValue) return '-';
		return formatDate(new Date(cellValue), 'YYYY-mm-dd');
	};
	//列表日期时间格式化
	const dateFormatYMDHMS = (row: any, column: number, cellValue: any) => {
		if (!cellValue) return '-';
		return formatDate(new Date(cellValue), 'YYYY-mm-dd HH:MM:SS');
	};
	//列表日期时间格式化
	const dateFormatHMS = (row: any, column: number, cellValue: any) => {
		if (!cellValue) return '-';
		let time = 0;
		if (typeof row === 'number') time = row;
		if (typeof cellValue === 'number') time = cellValue;
		return formatDate(new Date(time * 1000), 'HH:MM:SS');
	};
	// 小数格式化
	const scaleFormat = (value: any = 0, scale: number = 4) => {
		return Number.parseFloat(value).toFixed(scale);
	};
	// 小数格式化
	const scale2Format = (value: any = 0) => {
		return Number.parseFloat(value).toFixed(2);
	};
	// 点击复制文本
	const copyText = (text: string) => {
		return new Promise((resolve, reject) => {
			try {
				//复制
				toClipboard(text);
				//下面可以设置复制成功的提示框等操作
				ElMessage.success(t('message.layout.copyTextSuccess'));
				resolve(text);
			} catch (e) {
				//复制失败
				ElMessage.error(t('message.layout.copyTextError'));
				reject(e);
			}
		});
	};
	const formatXmlHtml = (str:string) => {
      const tab = '  ';
      let formatted = '';
      let indent = '';
      
      // 1. 统一处理换行和多余空格
      str = str
        .replace(/\r\n/g, '\n')  // 统一换行符
        .replace(/>\s+</g, '><') // 移除标签间的空格
        .replace(/\s+/g, ' ')    // 压缩多余空格（保留内容中的空格）
        .trim();
      
      // 2. 在每个标签后添加换行以便处理
      str = str
        .replace(/</g, '\n<')
        .replace(/>/g, '>\n')
        .replace(/\n+/g, '\n')
        .trim();
      
      // 3. 分割为行
      const lines = str.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // 跳过 XML 声明
        if (line.startsWith('<?xml')) {
          formatted += line + '\n';
          continue;
        }
        
        // 跳过 DOCTYPE
        if (line.startsWith('<!DOCTYPE')) {
          formatted += line + '\n';
          continue;
        }
        
        // 处理注释
        if (line.startsWith('<!--')) {
          // 如果注释是单行
          if (line.endsWith('-->')) {
            formatted += indent + line + '\n';
          } else {
            // 多行注释
            formatted += indent + line + '\n';
            let commentEnded = line.includes('-->');
            while (!commentEnded && i < lines.length - 1) {
              i++;
              const commentLine = lines[i].trim();
              formatted += indent + commentLine + '\n';
              if (commentLine.includes('-->')) commentEnded = true;
            }
          }
          continue;
        }
        
        // 处理 CDATA
        if (line.startsWith('<![CDATA[')) {
          formatted += indent + line + '\n';
          let cdataEnded = line.includes(']]>');
          while (!cdataEnded && i < lines.length - 1) {
            i++;
            const cdataLine = lines[i].trim();
            formatted += indent + cdataLine + '\n';
            if (cdataLine.includes(']]>')) cdataEnded = true;
          }
          continue;
        }
        
        // 判断是否是结束标签
        if (line.startsWith('</')) {
          indent = indent.substring(tab.length);
          formatted += indent + line + '\n';
        } 
        // 判断是否是自闭合标签
        else if (line.endsWith('/>') || line.match(/^<[^>]+\/>$/)) {
          formatted += indent + line + '\n';
        } 
        // 判断是否是开始标签
        else if (line.startsWith('<')) {
          formatted += indent + line + '\n';
          // 如果不是自闭合标签，增加缩进
          if (!line.endsWith('/>') && !line.match(/^<[^>]+\/>$/)) {
            indent += tab;
          }
        }
        // 文本内容
        else {
          formatted += indent + line + '\n';
        }
      }
      
      return formatted.trim();
    };
	const isJson = (str: string): boolean => {
      if (typeof str !== 'string') return false;
      try {JSON.parse(str); return true;} catch {return false;}
    };
	const toJson = (str: string):string => {
      if (str.trim() === '') return str;
      return isJson(str) ? JSON.stringify(JSON.parse(str)) : JSON.stringify(parse(str));
    }
	const toYamlOrJson = (str: string):string => {
      if (str.trim() === '') return str;
      return isJson(str) ? stringify(JSON.parse(str)) : JSON.stringify(parse(str), null, 2);
    }
    const isHtml = (str: string): boolean => {
      if (typeof str !== 'string') return false;
      str = str.trim();
      return /<[a-z][\s\S]*>/i.test(str) && str.includes('</');
    }
    const isYaml = (str: string): boolean => {
      if (typeof str !== 'string') return false;
      str = str.trim();
      return (str.includes(': ') || str.includes('- ')) && str.includes('\n');
    }
    const isXml = (str: string): boolean => {
      if (typeof str !== 'string') return false;
      str = str.trim();
      return str.startsWith('<?xml') || (/<[a-z][^>]*>[\s\S]*<\/[a-z]+>/i.test(str) && !isHtml(str));
    };
    const getFormatString = (str: string): string => {
      if (typeof str !== 'string') return str;
      str = str.trim();
      if (isJson(str)) return JSON.stringify(JSON.parse(str), null, 2);
      if (isYaml(str)) return stringify(parse(str));
      if (isXml(str) || isHtml(str)) return formatXmlHtml(str);
      return str;
    }
	return {
		percentFormat,
		dateFormatYMD,
		dateFormatYMDHMS,
		dateFormatHMS,
		scaleFormat,
		scale2Format,
		copyText,
		formatXmlHtml,
		toJson,
		isJson,
		toYamlOrJson,
		getFormatString,
		isYaml,
		isXml,
		isHtml,
	};
}
