# 自动式骨架屏组件

在需要等待加载内容的地方，提供一个占位的组合。

## 特征
- 与传统的骨架屏相比，自动式骨架屏更轻量，更易集成，更易使用。
- 自动化，鼠标右键点击生成骨架屏。

```jsx
import { useState, Fragment } from 'react';
import { AutoSkeleton } from 'gyp-gao-ui';

export default () => {
    const [isShow, setIsShow] = useState(true)
    return (
    <div>
        {isShow && <Fragment>
            <p>这是一个段落</p>
            <p>这是一个段落</p>
            <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            <div style={{marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <button>显示</button>
                <p>这是一个段落</p>
                <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </div>
            <div>
                <button>显示</button>
                <p>这是一个段落</p>
                <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />

                <div>
                    <button>显示</button>
                    <p>这是一个段落</p>
                    <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                    <div style={{marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <button>显示</button>
                        <p>这是一个段落</p>
                        <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                    </div>
                </div>
            </div>
        </Fragment>}
        <AutoSkeleton onComplete={() => {setIsShow(false)}} />
    </div>
)}
```

<API id="AutoSkeleton"></API>
