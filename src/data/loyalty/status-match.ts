/** Status Match / Challenge guides for hotel & airline programs */
export type StatusMatchPolicy = {
  programSlug: string;
  programName: string;
  programNameZh: string;
  type: "hotel" | "airline";
  offersMatch: boolean;
  offersChallenge: boolean;
  policyTitle: string;
  policyDesc: string;
  eligibleFrom: string[]; // programs you can match from
  matchDuration: string; // how long match lasts
  challengeNights?: number; // nights needed for challenge
  challengeDuration?: string; // challenge period
  howToApply: string;
  link?: string;
  tips: string[];
};

export const STATUS_MATCH_POLICIES: StatusMatchPolicy[] = [
  {
    programSlug: "world-of-hyatt",
    programName: "World of Hyatt",
    programNameZh: "凯悦天地",
    type: "hotel",
    offersMatch: true,
    offersChallenge: true,
    policyTitle: "环球客挑战（Corporate Challenge）",
    policyDesc: "凯悦为部分企业员工提供短期环球客挑战，非公开 Status Match。但可通过 MGM 会籍匹配获得 Explorist。",
    eligibleFrom: ["MGM Rewards Gold → Explorist"],
    matchDuration: "90 天（挑战期）",
    challengeNights: 20,
    challengeDuration: "90 天",
    howToApply: "企业渠道咨询 HR 或直接联系 Hyatt Sales；MGM Gold 在线匹配。",
    link: "https://world.hyatt.com/content/gp/en/rewards/mgm-rewards.html",
    tips: [
      "MGM Gold → Hyatt Explorist 是最快路径（免费匹配）",
      "挑战期内达到 20 晚可升级为环球客",
      "环球客挑战通常需通过企业邮箱申请",
    ],
  },
  {
    programSlug: "marriott-bonvoy",
    programName: "Marriott Bonvoy",
    programNameZh: "万豪旅享家",
    type: "hotel",
    offersMatch: false,
    offersChallenge: true,
    policyTitle: "白金挑战（Platinum Challenge）",
    policyDesc: "万豪不公开提供 Status Match，但电话客服可申请白金挑战：90 天内住满 16 晚获得白金会籍。",
    eligibleFrom: [],
    matchDuration: "N/A",
    challengeNights: 16,
    challengeDuration: "90 天",
    howToApply: "致电万豪客服热线（中国 400-8300-250），说明希望登记白金挑战。",
    tips: [
      "白金挑战期间享金卡临时待遇",
      "已有金卡的用户登记后直接按白金标准累积",
      "每个日历年最多申请一次挑战",
      "不可与信用卡赠送房晚叠加（挑战需实际入住）",
    ],
  },
  {
    programSlug: "ihg-one-rewards",
    programName: "IHG One Rewards",
    programNameZh: "洲际优悦会",
    type: "hotel",
    offersMatch: true,
    offersChallenge: false,
    policyTitle: "钻石挑战 / 会籍匹配",
    policyDesc: "IHG 可选购买 Ambassador（洲际大使）直接获白金会籍。持有其他酒店集团顶级会籍可联系客服尝试匹配。",
    eligibleFrom: ["Hilton Diamond", "Marriott Platinum+"],
    matchDuration: "12 个月（如批准）",
    howToApply: "通过 IHG 官网购买洲际大使（$200）获白金；高阶匹配需邮件联系 diamond@ihg.com。",
    tips: [
      "洲际大使 $200 即获白金会籍 + 周末住一送一券",
      "持 Hilton Diamond 邮件申请可能获得钻石挑战",
      "IHG 钻石是行业最慷慨的顶级会籍之一（双早+酒廊）",
    ],
  },
  {
    programSlug: "hilton-honors",
    programName: "Hilton Honors",
    programNameZh: "希尔顿荣誉客会",
    type: "hotel",
    offersMatch: true,
    offersChallenge: true,
    policyTitle: "金卡/钻石挑战",
    policyDesc: "希尔顿定期开放 Status Match 窗口。持有其他集团中高级会籍可申请，批准后 90 天内完成挑战。",
    eligibleFrom: ["Marriott Gold+", "IHG Platinum+", "Hyatt Explorist+", "Accor Gold+"],
    matchDuration: "90 天挑战期 → 完成后保级至次年 3 月",
    challengeNights: 8,
    challengeDuration: "90 天",
    howToApply: "通过 statusmatch.hiltonhonors.com 提交申请（需上传其他集团会籍证明截图）。",
    link: "https://www.hiltonhonors.com/en_US/status-match/landing/",
    tips: [
      "金卡挑战：90 天 8 晚；钻石挑战：90 天 14 晚",
      "挑战期间即享目标会籍所有待遇",
      "建议年初申请，最大化使用时间",
    ],
  },
  {
    programSlug: "accor-all",
    programName: "ALL – Accor Live Limitless",
    programNameZh: "雅高心悦界",
    type: "hotel",
    offersMatch: false,
    offersChallenge: false,
    policyTitle: "无公开 Status Match",
    policyDesc: "雅高心悦界不提供公开会籍匹配或挑战。可通过购买 Accor Plus 会员获取银卡，或通过 ibis Business 卡加速升级。",
    eligibleFrom: [],
    matchDuration: "N/A",
    howToApply: "通过 accorplus.com 购买 Accor Plus 会员（约 ¥1,500/年）获银卡 + 亚太区免费住宿券。",
    link: "https://www.accorplus.com",
    tips: [
      "Accor Plus 含亚太区住一送一券 + 餐饮折扣",
      "银卡是自动的，高等级只能硬住",
      "雅高积分可直接抵扣房费（1000 分 = €20）",
    ],
  },
  {
    programSlug: "eastern-miles",
    programName: "Eastern Miles",
    programNameZh: "东航东方万里行",
    type: "airline",
    offersMatch: true,
    offersChallenge: true,
    policyTitle: "东航挑战赛",
    policyDesc: "东方万里行不定期向持其他航司金卡以上用户开放挑战。挑战成功即获东航金/银卡。",
    eligibleFrom: ["CA 凤凰知音金卡+", "CZ 明珠金卡+", "HU 金鹏金卡+", "CX 马可孛罗银卡+"],
    matchDuration: "90 天挑战期",
    challengeDuration: "90 天",
    howToApply: "关注东方万里行微信公众号或 APP 活动公告，开放时在线登记。",
    tips: [
      "挑战成功会籍有效期至第三年 3 月",
      "东航金卡 = 天合联盟超级精英（SkyTeam Elite Plus）",
      "持天合联盟其他成员金卡可直接匹配",
    ],
  },
  {
    programSlug: "phoenix-miles",
    programName: "PhoenixMiles",
    programNameZh: "国航凤凰知音",
    type: "airline",
    offersMatch: false,
    offersChallenge: false,
    policyTitle: "无公开 Status Match",
    policyDesc: "国航凤凰知音极少开放 Status Match。唯一可行路径：持星空联盟其他成员金卡，致电客服咨询是否可匹配。",
    eligibleFrom: [],
    matchDuration: "N/A",
    howToApply: "无公开渠道。可尝试通过企业大客户渠道或致电 95583。",
    tips: [
      "国航白金卡是全国最难获得的航司会籍之一",
      "星空联盟金卡权益在乘坐国航时均有效",
      "建议先获取容易的星空联盟金卡（如 TK 土航、OZ 韩亚）",
    ],
  },
  {
    programSlug: "krisflyer",
    programName: "KrisFlyer",
    programNameZh: "新航 KrisFlyer",
    type: "airline",
    offersMatch: true,
    offersChallenge: false,
    policyTitle: "Status Match（不定期开放）",
    policyDesc: "新航不定期向部分市场开放 KrisFlyer Elite Gold 匹配。持有其他航司金卡可提交申请。",
    eligibleFrom: ["Any airline Gold tier"],
    matchDuration: "12 个月",
    howToApply: "关注新航官网 status match 页面或邮件联系 krisflyer@singaporeair.com.sg。",
    tips: [
      "KrisFlyer Gold = 星空联盟金卡",
      "新航里程兑换价值极高（Suite 头等套房）",
      "可通过万豪积分大量转入（3:1 + 赠送）",
    ],
  },
  {
    programSlug: "marco-polo",
    programName: "Cathay Membership",
    programNameZh: "国泰会员计划",
    type: "airline",
    offersMatch: true,
    offersChallenge: false,
    policyTitle: "会籍匹配（大中华区）",
    policyDesc: "国泰不定期向大中华区用户开放会籍匹配。持其他航司金银卡可申请。",
    eligibleFrom: ["CA 金卡+", "MU 金卡+", "CZ 金卡+"],
    matchDuration: "12 个月",
    howToApply: "关注国泰航空公众号或 cathaypacific.com 活动公告。",
    tips: [
      "国泰银卡 = 寰宇一家 Ruby（优先值机+行李）",
      "国泰金卡 = 寰宇一家蓝宝石（休息室+优先登机）",
      "亚洲万里通里程兑换价值优秀",
    ],
  },
];

export const STATUS_MATCH_BY_PROGRAM: Record<string, StatusMatchPolicy[]> = {};
STATUS_MATCH_POLICIES.forEach((p) => {
  if (!STATUS_MATCH_BY_PROGRAM[p.programSlug]) STATUS_MATCH_BY_PROGRAM[p.programSlug] = [];
  STATUS_MATCH_BY_PROGRAM[p.programSlug].push(p);
});
