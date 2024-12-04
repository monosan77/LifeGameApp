import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // SpecialEventのデータを挿入
  const specialEvents = await prisma.specialEvent.createMany({
    data: [
      {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
      {
        id: '1',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
      {
        id: '2',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
      {
        id: '3',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
      {
        id: '4',
        conditions: ['1-1', '2-2', '3-4', '5-5', '6-6'],
        effect_type: '*/',
        effect_value: [0, 0.5, 1, 2, 4],
        base_amount: [500, 1],
      },
      {
        id: '5',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
      {
        id: '6',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
      {
        id: '7',
        conditions: ['1-2', '3-4', '5-6'],
        effect_type: '*/',
        effect_value: [0.5, 2, 3],
        base_amount: [300, 1],
      },
      {
        id: '8',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
      {
        id: '9',
        conditions: ['1-1', '2-2', '3-6'],
        effect_type: '+-',
        effect_value: [10000, 5000, 0],
        base_amount: [0, 1],
      },
      {
        id: '10',
        conditions: ['1-2', '3-6'],
        effect_type: '*/',
        effect_value: [0, 0.5],
        base_amount: [0, 1],
      },
      {
        id: '11',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
      {
        id: '12',
        conditions: ['1-1', '2-2', '3-4', '5-6'],
        effect_type: '*/',
        effect_value: [20, 5, 1, 0.5],
        base_amount: [500, 1],
      },
      {
        id: '13',
        conditions: ['1-2', '3-4', '4-6'],
        effect_type: '*/',
        effect_value: [1.5, 2, 3],
        base_amount: [30000, 1],
      },
      {
        id: '14',
        conditions: ['1-1', '2-3', '4-6'],
        effect_type: '*/',
        effect_value: [0, 0.5, 0.25],
        base_amount: [0, 1],
      },
      {
        id: '15',
        conditions: ['1-3', '4-6'],
        effect_type: '*/',
        effect_value: [0, 2],
        base_amount: [0, 1],
      },
      {
        id: '16',
        conditions: ['1-1', '2-3', '4-6'],
        effect_type: '*/',
        effect_value: [0, 0.5, 0.25],
        base_amount: [0, 1],
      },
      {
        id: '17',
        conditions: ['1-1', '2-2', '3-4', '5-5', '6-6'],
        effect_type: '+-',
        effect_value: [500000, 100000, 30000, -100000, -500000],
        base_amount: [0, 1],
      },
    ],
  });
  // EventとEventContainerのデータを挿入
  const events = await prisma.event.createMany({
    data: [
      {
        id: '000',
        event_type: 'plus',
        title: '新たな人生の始まり',
        overview:
          'これから始まる新たな人生。とりあえず会社を辞めておくか。。。全員、退職金として300万受け取る。',
        src: 'event-0.png',
        value: 300,
        specialEventId: '0', // 特殊イベントのID
      },
      {
        id: '001',
        event_type: 'plus',
        title: 'ママからのおこずかい',
        overview:
          '毎月ママからおこずかいを貰っていたが、いきなり今月で最後と言い渡された。最後なので多めに 50万円 貰う。',
        src: 'event-1.png',
        value: 50,
        specialEventId: '0',
      },
      {
        id: '002',
        event_type: 'minus',
        title: 'スピード違反',
        overview:
          '車を運転していたら隠れていた警察にスピード違反で捕まる。罰金で 50万 支払う。',
        src: 'event-2.png',
        value: 50,
        specialEventId: '0',
      },
      {
        id: '003',
        event_type: 'minus',
        title: 'カツアゲ',
        overview:
          '道を歩いていたら高校生ヤンキーに絡まれカツアゲされる。100万円 失う。',
        src: 'event-3.png',
        value: 100,
        specialEventId: '0',
      },
      {
        id: '004',
        event_type: 'minus',
        title: '幸せの連続',
        overview:
          '友人の結婚式が連続で続く。嫉妬と虚無感を抱きながらご祝儀で合計 30万円 失う。',
        src: 'event-4.png',
        value: 30,
        specialEventId: '0',
      },
      {
        id: '005',
        event_type: 'special',
        title: '特殊イベント ~パチンコ~',
        overview:
          'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
        src: 'event-5.png',
        value: 0,
        specialEventId: '1',
      },
      {
        id: '006',
        event_type: 'plus',
        title: 'YouTuberへの道',
        overview:
          'たまたまパチンコの実況動画をYouTubeに揚げたらバズったようだ。収益として 100万円 もらう。',
        src: 'event-6.png',
        value: 100,
        specialEventId: '0',
      },
      {
        id: '007',
        event_type: 'plus',
        title: 'クイズ大会',
        overview: 'クイズ大会に出場し優勝した。賞金 100万円 もらう。',
        src: 'event-7.png',
        value: 100,
        specialEventId: '0',
      },
      {
        id: '008',
        event_type: 'special',
        title: '特殊イベント ~検討中~',
        overview:
          'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
        src: 'event-000.png',
        value: 0,
        specialEventId: '2',
      },
      {
        id: '009',
        event_type: 'plus',
        title: '無欲のポケカ',
        overview:
          '無心でポケモンカードを1パック買ったら、レアカードが当たった。売って 200万円 もらう。',
        src: 'event-9.png',
        value: 200,
        specialEventId: '0',
      },
      {
        id: '010',
        event_type: 'special',
        title: '特殊イベント ~検討中~',
        overview:
          'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
        src: 'event-000.png',
        value: 0,
        specialEventId: '3',
      },
      {
        id: '011',
        event_type: 'special',
        title: '特殊イベント ~仮想通貨~',
        overview:
          '仮想通貨に500万円賭ける。1が出たら 0倍、2が出たら 0.5倍、3~4が出たら 1倍、5以下がでたら 2倍、6が出たら 4倍 になる。',
        src: 'event-11.png',
        value: 0,
        specialEventId: '4',
      },
      {
        id: '012',
        event_type: 'plus',
        title: '月収チャンネル',
        overview:
          '月収チャンネルで300万円の融資を受け取るが、周囲から冷ややかな視線を感じることになる。 300万円 もらう。',
        src: 'event-12.png',
        value: 300,
        specialEventId: '0',
      },
      {
        id: '013',
        event_type: 'special',
        title: '特殊イベント ~検討中~',
        overview:
          'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
        src: 'event-000.png',
        value: 0,
        specialEventId: '5',
      },
      {
        id: '014',
        event_type: 'plus',
        title: '連続殺人犯を捕まえる',
        overview:
          '懸賞金付きの連続殺人犯を偶然逮捕した。懸賞金 500万円 もらう。',
        src: 'event-14.png',
        value: 500,
        specialEventId: '0',
      },
      {
        id: '015',
        event_type: 'minus',
        title: 'ぼったくりバー',
        overview:
          '隠れ家的なバーに入ったらそこは、ぼったくりバーだった。怖いお兄さんが脅され 300万円 支払うことになってしまった。',
        src: 'event-15.png',
        value: 300,
        specialEventId: '0',
      },
      {
        id: '016',
        event_type: 'plus',
        title: '埋蔵金',
        overview:
          'いじめられていた犬を救った。犬はお礼に埋蔵金を見つけてきた。 500万円もらう。',
        src: 'event-16.png',
        value: 500,
        specialEventId: '0',
      },
      {
        id: '017',
        event_type: 'plus',
        title: '急な気の狂い',
        overview:
          '急に気がくるってしまった。気づいたら目の前に300万があった。少し怖かったが 300万円 もらう。',
        src: 'event-17.png',
        value: 300,
        specialEventId: '0',
      },
      {
        id: '018',
        event_type: 'special',
        title: '特殊イベント ~検討中~',
        overview:
          'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
        src: 'event-000.png',
        value: 0,
        specialEventId: '6',
      },
      {
        id: '019',
        event_type: 'special',
        title: '特殊イベント ~時計を買う~',
        overview:
          '300万で購入した時計が数年後、価値が大きく変動した。ダイスを振り 1~2が出れば 0.5倍、3~4が出れば 2倍、5~6が出れば 3倍になる。',
        src: 'event-19.png',
        value: 0,
        specialEventId: '7',
      },
      {
        id: '020',
        event_type: 'special',
        title: '特殊イベント ~検討中~',
        overview:
          'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
        src: 'event-000.png',
        value: 0,
        specialEventId: '8',
      },
      {
        id: '021',
        event_type: 'plus',
        title: 'けがの功名',
        overview:
          '軽微な交通事故に会う。偶然相手がお金持ちで慰謝料を多めにもらう。800万円もらう。',
        src: 'event-21.png',
        value: 800,
        specialEventId: '0', // specialEventId を参照
      },
      {
        id: '022',
        event_type: 'plus',
        title: '遺産',
        overview: '思わぬところから親戚の遺産が手に入る。500万円 もらう。',
        src: 'event-22.png',
        value: 500,
        specialEventId: '0',
      },
      {
        id: '023',
        event_type: 'minus',
        title: 'ウイルス感染？',
        overview:
          '社用PCでウイルス対策サイトを閲覧しているとウイルスに感染した。800万円はらう。',
        src: 'event-23.png',
        value: 800,
        specialEventId: '0',
      },
      {
        id: '024',
        event_type: 'special',
        title: '特殊イベント ~宝くじ当選⁉~',
        overview:
          '宝くじを購入する。ダイスを振り 1 が出れば +1億円、2が出れば 5000万円、3~6は外れ +0万円 になる。',
        src: 'event-24.png',
        value: 0,
        specialEventId: '9',
      },
      {
        id: '025',
        event_type: 'minus',
        title: 'ねずみ講',
        overview:
          '信用していた人に1000万円預ける。しかし、その人はネズミ講だった。1000万円失う。',
        src: 'event-25.png',
        value: 1000,
        specialEventId: '0',
      },
      {
        id: '026',
        event_type: 'plus',
        title: '歌うま',
        overview: 'カラオケで歌っている映像が大バズり。1000万円 もらう',
        src: 'event-26.png',
        value: 1000,
        specialEventId: '0',
      },
      {
        id: '027',
        event_type: 'minus',
        title: '負の遺産相続',
        overview:
          '愛するおじいちゃんがなくなってしまう。悲しみながらおじいちゃんが残した遺産を貰う。負の遺産だったため、―3000万円支払う。',
        src: 'event-27.png',
        value: 3000,
        specialEventId: '0',
      },
      {
        id: '028',
        event_type: 'plus',
        title: 'ペットの赤ちゃん',
        overview:
          'ペットに赤ちゃんができお金持ちに引き取ってもらう。お礼に 1000万円 もらう。',
        src: 'event-28.png',
        value: 1000,
        specialEventId: '0',
      },
      {
        id: '029',
        event_type: 'minus',
        title: '炎上',
        overview:
          'SNSにギャンブルに勝った自慢をする。炎上し住所を特定され泥棒に入られる。2000万円失う。',
        src: 'event-29.png',
        value: 2000,
        specialEventId: '0',
      },
      {
        id: '030',
        event_type: 'special',
        title: '特殊イベント ~検討中~',
        overview:
          'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
        src: 'event-000.png',
        value: 0,
        specialEventId: '11',
      },
      {
        id: '031',
        event_type: 'minus',
        title: '事業失敗',
        overview:
          'ハニートラップに引っかかり週刊誌に取り上げられる。会社の評判が悪くなり事業に失敗する。 2000万円はらう。',
        src: 'event-31.png',
        value: 2000,
        specialEventId: '0',
      },
      {
        id: '032',
        event_type: 'special',
        title: '特殊イベント ~神様は不機嫌~',
        overview:
          '不機嫌な神様から八つ当たりをくらう。全財産を掛けダイスを振る。1~2が出れば0円、3~6が出れば所持金は半分になる。',
        src: 'event-32.png',
        value: 0,
        specialEventId: '10',
      },
      {
        id: '033',
        event_type: 'minus',
        title: '生命の誕生',
        overview:
          '子供が生まれ養育費が生じる。あれ？独り身だったような。。。3000万円払う。',
        src: 'event-33.png',
        value: 3000,
        specialEventId: '0',
      },
      {
        id: '034',
        event_type: 'plus',
        title: '未発見の生命体',
        overview:
          '庭を掘ったら不思議な生命体を発見する。それは未発見生命体だった。世界中から注目され賞賛された。 5000万円もらう。',
        src: 'event-34.png',
        value: 5000,
        specialEventId: '0',
      },
      {
        id: '035',
        event_type: 'special',
        title: '特殊イベント ~競馬~',
        overview:
          '500万円分の馬券を購入。ダイスを振り 1が出ると 20倍、2が出ると 5倍、3~4が出ると 1倍、5~6が出れば0.5倍になる。',
        src: 'event-35.png',
        value: 0,
        specialEventId: '12',
      },
      {
        id: '036',
        event_type: 'minus',
        title: '地面師詐欺',
        overview:
          'Netflixで話題の地面師。自分は引っかからないだろうと思っていたら簡単に引っかかる。10億円の被害にある。',
        src: 'event-36.png',
        value: 100000,
        specialEventId: '0',
      },
      {
        id: '037',
        event_type: 'plus',
        title: '新規事業',
        overview:
          'ギャンブル講座の新規事業を始める。有名YouTuberに取り上げてもらい有名になり儲かる。 5000万円もらう。',
        src: 'event-37.png',
        value: 5000,
        specialEventId: '0',
      },
      {
        id: '038',
        event_type: 'special',
        title: '特殊イベント ~家を買う~',
        overview:
          '3億円で豪邸を買う。数年後土地価格が上昇し高値で売れることになった。ダイスを振り、1~2が出れば1.5倍,3~4が出れば2倍、5~6が出れば3倍になる。',
        src: 'event-38.png',
        value: 0,
        specialEventId: '13',
      },
      {
        id: '039',
        event_type: 'plus',
        title: '!!!!????',
        overview: 'ひょんなことから大金が手に入る。1億円もらう。',
        src: 'event-39.png',
        value: 10000,
        specialEventId: '0',
      },
      {
        id: '040',
        event_type: 'special',
        title: '特殊イベント ~社会貢献~',
        overview:
          '急に社旗貢献したくなりユニセフに寄付をする。喜びに満ち溢れながら、所持金を賭けダイスを振る。1が出ると全額、2~3が出ると半額、4~6が出ると1/4を寄付する。',
        src: 'event-40.png',
        value: 0,
        specialEventId: '14',
      },
      {
        id: '041',
        event_type: 'plus',
        title: '大親友',
        overview: '大親友がそばにいる価値に気づく。1億円もらう。',
        src: 'event-41.png',
        value: 10000,
        specialEventId: '0',
      },
      {
        id: '042',
        event_type: 'plus',
        title: '聖人登場',
        overview:
          '実は昔ヒカキンに恩を売っていて、当時のお返しを貰う。1億円もらう。',
        src: 'event-42.png',
        value: 10000,
        specialEventId: '0',
      },
      {
        id: '043',
        event_type: 'plus',
        title: 'マスターの好意',
        overview: 'ゲームマスターの機嫌がよくなった。3億円もらう。',
        src: 'event-43.png',
        value: 30000,
        specialEventId: '0',
      },
      {
        id: '044',
        event_type: 'plus',
        title: '愛する人との出会い',
        overview:
          '生涯愛する運命の人と出会う。気分がよくなりすべてがうまくいくようになった。4億円もらう',
        src: 'event-44.png',
        value: 40000,
        specialEventId: '0',
      },
      {
        id: '045',
        event_type: 'special',
        title: '特殊イベント ~オールイン~',
        overview:
          '所持金のすべてを賭ける。ダイスを振り、1~3が出ると 全て を失い、4~6が出ると 2倍 になる。',
        src: 'event-45.png',
        value: 0,
        specialEventId: '15',
      },
      {
        id: '046',
        event_type: 'minus',
        title: '大暴落',
        overview: '必ず利益が出ると思っていた株が大暴落する。5億円の損失。',
        src: 'event-46.png',
        value: 50000,
        specialEventId: '0',
      },
      {
        id: '047',
        event_type: 'minus',
        title: '火事',
        overview:
          'ネズミがブレイカーの配線を嚙みちぎり火花が発生し出火する。気づいたころには燃え広がり火事になる。5000万円の損失。',
        src: 'event-47.png',
        value: 5000,
        specialEventId: '0',
      },
      {
        id: '048',
        event_type: 'plus',
        title: '株',
        overview: '持っていた株の価格が大幅に上がる。5億円もらう。',
        src: 'event-48.png',
        value: 50000,
        specialEventId: '0',
      },
      {
        id: '049',
        event_type: 'special',
        title: '特殊イベント～破産～',
        overview:
          'ギャンブルに負け続け多額の借金を抱える。自己破産を申告し全財産を失う',
        src: 'event-49.png',
        value: 0,
        specialEventId: '16',
      },
      {
        id: '050',
        event_type: 'special',
        title: '特殊イベント ~ラストチャンス~',
        overview:
          '勝負はまだ終わっていない。ダイスを振り、1が出ると +50億円、2が出ると +10億円、3~4が出ると +3億円、5が出ると -10億円、6が出ると -50億円 にする。',
        src: 'event-50.png',
        value: 0,
        specialEventId: '17',
      },
    ],
  });

  // EventContainerのデータを挿入
  const eventContainers = await prisma.eventContainer.createMany({
    data: [
      { id: '0', eventId: '000' },
      { id: '1', eventId: '001' },
      { id: '2', eventId: '002' },
      { id: '3', eventId: '003' },
      { id: '4', eventId: '004' },
      { id: '5', eventId: '005' },
      { id: '6', eventId: '006' },
      { id: '7', eventId: '007' },
      { id: '8', eventId: '008' },
      { id: '9', eventId: '009' },
      { id: '10', eventId: '010' },
      { id: '11', eventId: '011' },
      { id: '12', eventId: '012' },
      { id: '13', eventId: '013' },
      { id: '14', eventId: '014' },
      { id: '15', eventId: '015' },
      { id: '16', eventId: '016' },
      { id: '17', eventId: '017' },
      { id: '18', eventId: '018' },
      { id: '19', eventId: '019' },
      { id: '20', eventId: '020' },
      { id: '21', eventId: '021' },
      { id: '22', eventId: '022' },
      { id: '23', eventId: '023' },
      { id: '24', eventId: '024' },
      { id: '25', eventId: '025' },
      { id: '26', eventId: '026' },
      { id: '27', eventId: '027' },
      { id: '28', eventId: '028' },
      { id: '29', eventId: '029' },
      { id: '30', eventId: '030' },
      { id: '31', eventId: '031' },
      { id: '32', eventId: '032' },
      { id: '33', eventId: '033' },
      { id: '34', eventId: '034' },
      { id: '35', eventId: '035' },
      { id: '36', eventId: '036' },
      { id: '37', eventId: '037' },
      { id: '38', eventId: '038' },
      { id: '39', eventId: '039' },
      { id: '40', eventId: '040' },
      { id: '41', eventId: '041' },
      { id: '42', eventId: '042' },
      { id: '43', eventId: '043' },
      { id: '44', eventId: '044' },
      { id: '45', eventId: '045' },
      { id: '46', eventId: '046' },
      { id: '47', eventId: '047' },
      { id: '48', eventId: '048' },
      { id: '49', eventId: '049' },
      { id: '50', eventId: '050' },
    ],
  });

  console.log('Data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
