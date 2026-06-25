# H&C · Hotel Collection

高端酒店垂直社区 — 白名单酒店库、入住足迹、社区分享与专属预订。

## 功能概览

### 酒店库
- **899+** 家在营奢华酒店，覆盖全球主要城市与度假胜地
- 按 **度假胜地 / 中国城市 / 集团 / 品牌 / 联盟** 多维筛选
- 独立品牌页：四季、文华东方、白马庄园
- 酒店详情页展示官网介绍、官方图片与官网链接（自动抓取 enrichment）

### 入住与社区
- **入住打卡**：表单记录 + 凭证上传（照片 / 订单 / 房卡）
- **足迹总览**：全球地图点亮、按集团 / 城市分层、房卡墙
- **荣誉称号**：26 个徽章，按晚数 / 品牌数 / 区域解锁
- **社区瀑布流**：结构化点评、集团筛选、详情页硬核维度
- **房卡交流**：展示 / 出让 / 求换

### 会员与预订
- **Plus 会员**：免费 6 次打卡上限，Plus 无限（演示模式一键升级）
- **专属预订**：提交意向 → 跳转企业微信顾问代订

**演示账号**：`demo@hc.com` / `demo123`

## 数据覆盖

| 维度 | 说明 |
|------|------|
| 在营酒店 | 899 家 |
| 酒店集团 | 9 个（万豪、凯悦、洲际、希尔顿、雅高 + 四季 / 文华东方 / 白马 + 独立奢华） |
| 品牌 | 58 个 |
| 联盟 | 5 个（立鼎世、罗莱夏朵、璞富腾、SLH、设计酒店） |

**目的地重点**：马尔代夫、大溪地、博德鲁姆、巴厘岛、普吉岛、苏梅岛、富国岛、加勒比、非洲游猎、印度洋岛屿、中国各大城市等。

数据按 **2026 年** 品牌现状维护，已剔除停业物业，换牌物业已标注（如上海四季停业、香港洲际 → 丽晶）。

## 技术栈

- **框架**：Next.js 15 + TypeScript + Tailwind CSS 4
- **数据库**：Prisma + SQLite
- **地图**：Leaflet / react-leaflet
- **UI**：白底高级感设计，移动端适配

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/ada-yq225/HotelCollections.git
cd HotelCollections

# 安装依赖
npm install

# 初始化数据库并导入种子数据
npm run db:setup

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | SQLite 路径，默认 `file:./dev.db` |
| `NEXTAUTH_SECRET` | 会话密钥（生产环境请修改） |
| `NEXTAUTH_URL` | 站点 URL，默认 `http://localhost:3000` |

## 常用命令

```bash
npm run dev              # 开发模式
npm run build            # 生产构建
npm run start            # 生产启动
npm run db:setup         # 建表 + 种子数据
npm run db:seed          # 仅重新导入种子
npm run hotels:enrich    # 批量抓取官网介绍与图片
npm run hotels:enrich-images  # 仅补全缺失封面图
```

## 项目结构

```
hotel-collection/
├── prisma/
│   ├── schema.prisma    # 数据模型
│   └── seed.ts          # 种子脚本
├── scripts/
│   └── enrich-hotels.ts # 官网内容批量抓取
├── src/
│   ├── app/             # 页面与 API 路由
│   ├── components/      # UI 组件
│   ├── data/
│   │   ├── hotels/      # 酒店数据（按区域 / 品牌拆分）
│   │   ├── destinations.ts
│   │   └── hotel-enrichment.json  # 官网抓取缓存
│   └── lib/             # 认证、徽章、酒店 enrichment 逻辑
└── public/
```

## 酒店数据维护

酒店源数据位于 `src/data/hotels/`，按区域与品牌分文件维护，在 `index.ts` 合并去重后由 `prisma/seed.ts` 写入数据库。

新增酒店后：

```bash
npm run db:seed                    # 更新数据库
npm run hotels:enrich-images       # 补全官网封面（可选）
```

## License

Private project — 仅供 H&C 社区内部使用。