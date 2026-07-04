# IP Geo Follow

让 Chrome / Edge 浏览器 GPS 定位自动跟随当前公网 IP 地址位置的扩展。

这个扩展适合在使用 VPN、代理或 VPS 节点时，让网页读取到的浏览器 GPS 位置与当前出口 IP 地区保持一致。

## 中文使用说明

### 功能

- 根据当前公网 IP 自动获取地理位置。
- 伪装网页读取到的 `navigator.geolocation`。
- 支持 Chrome 和 Microsoft Edge。
- 支持开发者模式加载，无需打包或构建。
- 每分钟自动刷新一次位置。
- 支持在弹窗中点击“立即刷新”。
- 当识别到中国大陆 IP 时，默认回退到 `(0, 0)` 保护隐私。

### 重要说明

这个扩展只修改浏览器 GPS 定位结果，不会修改你的真实 IP。

真实 IP 取决于你的 VPN、代理或 VPS 出口。

```text
IP 位置：取决于 VPN / 代理 / VPS 出口
浏览器 GPS 定位：由本扩展伪装成当前 IP 对应的位置
```

理想状态是：

```text
IP = VPN / 代理地区
GPS = VPN / 代理地区
```

### Chrome 安装方式

1. 打开 Chrome。
2. 在地址栏输入：

```text
chrome://extensions/
```

3. 打开右上角的“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择本项目里的这个文件夹：

```text
ip-geo-follow
```

6. 加载成功后，右上角扩展栏会出现 `IP Geo Follow`。
7. 点击扩展图标，可以查看当前 IP、位置、经纬度、更新时间。
8. 如果目标网页之前已经请求过定位，刷新目标网页一次。
9. 出口 IP 变化后，可以点击扩展里的“立即刷新”。

### Edge 安装方式

1. 打开 Microsoft Edge。
2. 在地址栏输入：

```text
edge://extensions/
```

3. 打开“开发人员模式”。
4. 点击“加载解压缩的扩展”或“加载已解压的扩展程序”。
5. 选择本项目里的这个文件夹：

```text
ip-geo-follow
```

6. 加载成功后，Edge 扩展栏会出现 `IP Geo Follow`。
7. 点击扩展图标查看当前伪装的 GPS 信息。
8. 如果目标网页之前已经请求过定位，刷新目标网页一次。
9. 出口 IP 变化后，可以点击扩展里的“立即刷新”。

### 无痕模式 / InPrivate 使用

如果需要在无痕模式使用，需要手动允许扩展运行。

Chrome：

1. 打开 `chrome://extensions/`。
2. 找到 `IP Geo Follow`。
3. 点击“详情”。
4. 打开“允许在无痕模式下使用”。
5. 关闭所有无痕窗口。
6. 重新打开无痕窗口。
7. 点击扩展里的“立即刷新”。

Edge：

1. 打开 `edge://extensions/`。
2. 找到 `IP Geo Follow`。
3. 点击“详细信息”。
4. 打开“允许 InPrivate”。
5. 关闭所有 InPrivate 窗口。
6. 重新打开 InPrivate。
7. 点击扩展里的“立即刷新”。

### 代理建议

最稳的方式是使用全局代理模式。

至少要保证下面这些流量走同一个 VPN / 代理节点：

```text
目标网站
ipwho.is
Chrome / Edge 浏览器流量
```

如果目标网站走 VPN，但 `ipwho.is` 没走 VPN，可能会导致 GPS 位置和 IP 位置不一致。

### 测试是否生效

可以打开任意浏览器定位测试网站，或者在网页控制台执行：

```js
navigator.geolocation.getCurrentPosition(console.log)
```

如果返回的 `latitude` 和 `longitude` 接近当前 VPN / 代理出口 IP 的位置，就说明生效。

## English Usage

### Features

- Detects geolocation from the current public IP address.
- Spoofs the webpage-facing `navigator.geolocation` API.
- Supports Chrome and Microsoft Edge.
- Works as an unpacked extension in developer mode.
- Refreshes the location every minute.
- Supports manual refresh from the popup.
- Uses `(0, 0)` as a privacy fallback when the detected country code is `CN`.

### Important Note

This extension only changes the browser Geolocation API result. It does not change your real IP address.

Your real IP address depends on your VPN, proxy, or VPS exit node.

```text
IP location: depends on your VPN / proxy / VPS exit
Browser GPS location: spoofed by this extension to match the current IP location
```

Expected state:

```text
IP = VPN / proxy region
GPS = VPN / proxy region
```

### Chrome Installation

1. Open Chrome.
2. Enter this in the address bar:

```text
chrome://extensions/
```

3. Enable "Developer mode".
4. Click "Load unpacked".
5. Select this folder from the project:

```text
ip-geo-follow
```

6. After loading, `IP Geo Follow` will appear in the extension area.
7. Click the extension icon to view the current IP, location, coordinates, and update time.
8. If the target page requested location before injection, reload the page once.
9. When your exit IP changes, click "立即刷新" in the popup.

### Edge Installation

1. Open Microsoft Edge.
2. Enter this in the address bar:

```text
edge://extensions/
```

3. Enable "Developer mode".
4. Click "Load unpacked".
5. Select this folder from the project:

```text
ip-geo-follow
```

6. After loading, `IP Geo Follow` will appear in the extension area.
7. Click the extension icon to view the spoofed GPS information.
8. If the target page requested location before injection, reload the page once.
9. When your exit IP changes, click "立即刷新" in the popup.

### Incognito / InPrivate

To use the extension in private browsing, allow it manually.

Chrome:

1. Open `chrome://extensions/`.
2. Find `IP Geo Follow`.
3. Click "Details".
4. Enable "Allow in Incognito".
5. Close all Incognito windows.
6. Open a new Incognito window.
7. Click "立即刷新" in the extension popup.

Edge:

1. Open `edge://extensions/`.
2. Find `IP Geo Follow`.
3. Click "Details".
4. Enable "Allow in InPrivate".
5. Close all InPrivate windows.
6. Open a new InPrivate window.
7. Click "立即刷新" in the extension popup.

### Proxy Recommendation

Global proxy mode is recommended.

At minimum, make sure the following traffic goes through the same VPN / proxy node:

```text
Target website
ipwho.is
Chrome / Edge browser traffic
```

If the target website uses the VPN but `ipwho.is` does not, the spoofed GPS location may not match the visible IP location.

### Test

Open any browser geolocation test website, or run this in the webpage console:

```js
navigator.geolocation.getCurrentPosition(console.log)
```

If the returned `latitude` and `longitude` are close to the current VPN / proxy exit IP location, the extension is working.

## Upload Updates

After editing the project locally, upload changes with:

```powershell
cd E:\IP
git add .
git commit -m "describe your change"
git push
```

## License

MIT
