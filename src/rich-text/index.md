# 富文本组件

> 基于 wangEditor 实现的富文本组件

```jsx
/**
 * title: 富文本
 */
import { RichText } from 'gyp-gao-ui';

export default () => (
  <>
    <RichText onChange={(value) => {console.log(value)}} />
  </>
);
```
<API id="RichText"></API>