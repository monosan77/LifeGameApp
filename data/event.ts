import { Event_Mold } from '@/types/game';

export const EVENTS: Event_Mold[] = [
  {
    id: '0',
    event: {
      id: '000',
      event_type: 'plus',
      title: '新たな人生の始まり',
      overview:
        'これから始まる新たな人生。とりあえず会社を辞めておくか。。。全員、退職金として300万受け取る。',
      src: 'event-0.png',
      value: 300,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '1',
    event: {
      id: '001',
      event_type: 'plus',
      title: 'ママからのおこずかい',
      overview:
        '毎月ママからおこずかいを貰っていたが、いきなり今月で最後と言い渡された。最後なので多めに 50万円 貰う。',
      src: 'event-1.png',
      value: 50,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '2',
    event: {
      id: '002',
      event_type: 'minus',
      title: 'スピード違反',
      overview:
        '車を運転していたら隠れていた警察にスピード違反で捕まる。罰金で 50万 支払う。',
      src: 'event-2.png',
      value: 50,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '3',
    event: {
      id: '003',
      event_type: 'minus',
      title: 'カツアゲ',
      overview:
        '道を歩いていたら高校生ヤンキーに絡まれカツアゲされる。100万円 失う。',
      src: 'event-3.png',
      value: 100,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '4',
    event: {
      id: '004',
      event_type: 'minus',
      title: '幸せの連続',
      overview:
        '友人の結婚式が連続で続く。嫉妬と虚無感を抱きながらご祝儀で合計 30万円 失う。',
      src: 'event-4.png',
      value: 30,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '5',
    event: {
      id: '005',
      event_type: 'special',
      title: '特殊イベント ~パチンコ~',
      overview:
        'カイジの沼のようなパチンコ台を見つける。ダイスを振り 1~3が出れば +300万円、4~6が出れば -50万円',
      src: 'event-5.png',
      value: 0,
      special_event: {
        id: '1',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [300, -50],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '6',
    event: {
      id: '006',
      event_type: 'plus',
      title: 'YouTuberへの道',
      overview:
        'たまたまパチンコの実況動画をYouTubeに揚げたらバズったようだ。収益として 100万円 もらう。',
      src: 'event-6.png',
      value: 100,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '7',
    event: {
      id: '007',
      event_type: 'plus',
      title: 'クイズ大会',
      overview: 'クイズ大会に出場し優勝した。賞金 100万円 もらう。',
      src: 'event-7.png',
      value: 100,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '8',
    event: {
      id: '008',
      event_type: 'special',
      title: '特殊イベント ~闇金取り立て~',
      overview:
        '闇金に借金してしまった！ダイスを振り 1~3が出れば -600万円の借金、4~6が出れば 闇金の取り立て屋をうまくかわし、ペナルティなし',
      src: 'event-8.png',
      value: 0,
      special_event: {
        id: '2',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [-600, 0],
        base_amount: [0],
      },
    },
  },
  {
    id: '9',
    event: {
      id: '009',
      event_type: 'plus',
      title: '無欲のポケカ',
      overview:
        '無心でポケモンカードを1パック買ったら、レアカードが当たった。売って 200万円 もらう。',
      src: 'event-9.png',
      value: 200,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '10',
    event: {
      id: '010',
      event_type: 'special',
      title: '特殊イベント ~ 高額宝くじを購入！1回300万円~',
      overview:
        'ダイスを1回振り、出た目に応じて報酬が変わる。1: ハズレ（宝くじ代没収）:2～3: 購入金額と同額を回収。4～5: 購入金額の 5倍 を獲得！6: 大当たり！10倍 を獲得！',
      src: 'event-10.png',
      value: 0,
      special_event: {
        id: '3',
        conditions: ['1-1', '2-3', '4-5', '6-6'],
        effect_type: '*/',
        effect_value: [0, 1, 5, 10],
        base_amount: [300, 1],
      },
    },
  },
  {
    id: '11',
    event: {
      id: '011',
      event_type: 'special',
      title: '特殊イベント ~仮想通貨~',
      overview:
        '仮想通貨に500万円賭ける。1が出たら 0倍、2が出たら 0.5倍、3~4が出たら 1倍、5以下がでたら 2倍、6が出たら 4倍 になる。',
      src: 'event-11.png',
      value: 0,
      special_event: {
        id: '4',
        conditions: ['1-1', '2-2', '3-4', '5-5', '6-6'],
        effect_type: '*/',
        effect_value: [0, 0.5, 1, 2, 4],
        base_amount: [500, 1],
      },
    },
  },
  {
    id: '12',
    event: {
      id: '012',
      event_type: 'plus',
      title: '月収チャンネル',
      overview:
        '月収チャンネルで300万円の融資を受け取るが、周囲から冷ややかな視線を感じることになる。 300万円 もらう。',
      src: 'event-12.png',
      value: 300,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '13',
    event: {
      id: '013',
      event_type: 'special',
      title: '特殊イベント ~ラッキーマス~',
      overview:
        '幸運のマス！止まるだけでボーナス。ダイスを振り、出た目 × 100万円 を獲得',
      src: 'event-13.png',
      value: 0,
      special_event: {
        id: '5',
        conditions: ['1-1', '2-2', '3-3', '4-4', '5-5', '6-6'],
        effect_type: '*/',
        effect_value: [1, 2, 3, 4, 5, 6],
        base_amount: [100, 1],
      },
    },
  },
  {
    id: '14',
    event: {
      id: '014',
      event_type: 'plus',
      title: '連続殺人犯を捕まえる',
      overview: '懸賞金付きの連続殺人犯を偶然逮捕した。懸賞金 500万円 もらう。',
      src: 'event-14.png',
      value: 500,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '15',
    event: {
      id: '015',
      event_type: 'minus',
      title: 'ぼったくりバー',
      overview:
        '隠れ家的なバーに入ったらそこは、ぼったくりバーだった。怖いお兄さんが脅され 300万円 支払うことになってしまった。',
      src: 'event-15.png',
      value: 300,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '16',
    event: {
      id: '016',
      event_type: 'plus',
      title: '埋蔵金',
      overview:
        'いじめられていた犬を救った。犬はお礼に埋蔵金を見つけてきた。 500万円もらう。',
      src: 'event-16.png',
      value: 500,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '17',
    event: {
      id: '017',
      event_type: 'plus',
      title: '急な気の狂い',
      overview:
        '急に気がくるってしまった。気づいたら目の前に300万があった。少し怖かったが 300万円 もらう。',
      src: 'event-17.png',
      value: 300,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '18',
    event: {
      id: '018',
      event_type: 'special',
      title: '特殊イベント ~投資詐欺に遭う~',
      overview:
        '怪しい投資話に乗ってしまった。ダイスを振り 1~3が出れば 投資失敗！所持金が半分になる。4~6が出れば 投資成功！所持金が2倍になる。',
      src: 'event-18.png',
      value: 0,
      special_event: {
        id: '6',
        conditions: ['1-3', '4-6'],
        effect_type: '*/',
        effect_value: [0.5, 2],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '19',
    event: {
      id: '019',
      event_type: 'special',
      title: '特殊イベント ~時計を買う~',
      overview:
        '300万で購入した時計が数年後、価値が大きく変動した。ダイスを振り 1~2が出れば 0.5倍、3~4が出れば 2倍、5~6が出れば 3倍になる。',
      src: 'event-19.png',
      value: 0,
      special_event: {
        id: '7',
        conditions: ['1-2', '3-4', '5-6'],
        effect_type: '*/',
        effect_value: [0.5, 2, 3],
        base_amount: [300, 1],
      },
    },
  },
  {
    id: '20',
    event: {
      id: '020',
      event_type: 'special',
      title: '特殊イベント ~謎のオークション~',
      overview:
        '怪しいオークションに参加する。ダイスを振り 1~3が出れば 偽物を掴む！所持金が-1,000万円。4~6が出れば お宝を手に入れ、大儲け！所持金が+3,000万円',
      src: 'event-20.png',
      value: 0,
      special_event: {
        id: '8',
        conditions: ['1-3', '4-6'],
        effect_type: '+-',
        effect_value: [-1000, 3000],
        base_amount: [0],
      },
    },
  },
  {
    id: '21',
    event: {
      id: '021',
      event_type: 'plus',
      title: 'けがの功名',
      overview:
        '軽微な交通事故に会う。偶然相手がお金持ちで慰謝料を多めにもらう。800万円もらう。',
      src: 'event-21.png',
      value: 800,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '22',
    event: {
      id: '022',
      event_type: 'plus',
      title: '遺産',
      overview: '思わぬところから親戚の遺産が手に入る。500万円 もらう。',
      src: 'event-22.png',
      value: 500,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '23',
    event: {
      id: '023',
      event_type: 'minus',
      title: 'ウイルス感染？',
      overview:
        '社用PCでウイルス対策サイトを閲覧しているとウイルスに感染した。800万円はらう。',
      src: 'event-23.png',
      value: 800,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '24',
    event: {
      id: '024',
      event_type: 'special',
      title: '特殊イベント ~宝くじ当選⁉~',
      overview:
        '宝くじを購入する。ダイスを振り 1 が出れば +1億円、2が出れば 5000万円、3~6は外れ +0万円 になる。',
      src: 'event-24.png',
      value: 0,
      special_event: {
        id: '9',
        conditions: ['1-1', '2-2', '3-6'],
        effect_type: '+-',
        effect_value: [10000, 5000, 0],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '25',
    event: {
      id: '025',
      event_type: 'minus',
      title: 'ねずみ講',
      overview:
        '信用していた人に1000万円預ける。しかし、その人はネズミ講だった。1000万円失う',
      src: 'event-25.png',
      value: 1000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '26',
    event: {
      id: '026',
      event_type: 'plus',
      title: '歌うま',
      overview: 'カラオケで歌っている映像が大バズり。1000万円 もらう',
      src: 'event-26.png',
      value: 1000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '27',
    event: {
      id: '027',
      event_type: 'minus',
      title: '負の遺産相続',
      overview:
        '愛するおじいちゃんがなくなってしまう。悲しみながらおじいちゃんが残した遺産を貰う。 負の遺産だったため、―3000万円支払う。',
      src: 'event-27.png',
      value: 3000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '28',
    event: {
      id: '028',
      event_type: 'plus',
      title: 'ペットの赤ちゃん',
      overview:
        'ペットに赤ちゃんができお金持ちに引き取ってもらう。お礼に 1000万円 もらう。',
      src: 'event-28.png',
      value: 1000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '29',
    event: {
      id: '029',
      event_type: 'minus',
      title: '炎上',
      overview:
        'SNSにギャンブルに勝った自慢をする。炎上し住所を特定され泥棒に入られる。2000万円失う。',
      src: 'event-29.png',
      value: 2000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '30',
    event: {
      id: '030',
      event_type: 'special',
      title: '特殊イベント ~天災マス~',
      overview:
        '災害により被害を受ける。ダイスを振り 1~2が出れば -4,000万円、3~4が出れば 保険でカバーされ変動なし。 5~6が出れば 多くの人が援助活動 +6,000万円',
      src: 'event-30.png',
      value: 0,
      special_event: {
        id: '11',
        conditions: ['1-2', '3-4', '5-6'],
        effect_type: '+-',
        effect_value: [-4000, 0, 6000],
        base_amount: [0],
      },
    },
  },
  {
    id: '31',
    event: {
      id: '031',
      event_type: 'minus',
      title: '事業失敗',
      overview:
        'ハニートラップに引っかかり週刊誌に取り上げられる。会社の評判が悪くなり事業に失敗する。 2000万円はらう。',
      src: 'event-31.png',
      value: 2000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '32',
    event: {
      id: '032',
      event_type: 'special',
      title: '特殊イベント ~神様は不機嫌~',
      overview:
        '不機嫌な神様から八つ当たりをくらう。全財産を掛けダイスを振る。1~2が出れば0円、3~6が出れば所持金は半分になる。',
      src: 'event-32.png',
      value: 0,
      special_event: {
        id: '10',
        conditions: ['1-2', '3-6'],
        effect_type: '*/',
        effect_value: [0, 0.5],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '33',
    event: {
      id: '033',
      event_type: 'minus',
      title: '生命の誕生',
      overview:
        '子供が生まれ養育費が生じる。あれ？独り身だったような。。。3000万円払う。',
      src: 'event-33.png',
      value: 3000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '34',
    event: {
      id: '034',
      event_type: 'plus',
      title: '未発見の生命体',
      overview:
        '庭を掘ったら不思議な生命体を発見する。それは未発見生命体だった。世界中から注目され賞賛された。 5000万円もらう。',
      src: 'event-34.png',
      value: 5000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '35',
    event: {
      id: '035',
      event_type: 'special',
      title: '特殊イベント ~競馬~',
      overview:
        '500万円分の馬券を購入。ダイスを振り 1が出ると 20倍、2が出ると 5倍、3~4が出ると 1倍、5~6が出れば0.5倍になる。',
      src: 'event-35.png',
      value: 0,
      special_event: {
        id: '12',
        conditions: ['1-1', '2-2', '3-4', '5-6'],
        effect_type: '*/',
        effect_value: [20, 5, 1, 0.5],
        base_amount: [500, 1],
      },
    },
  },
  {
    id: '36',
    event: {
      id: '036',
      event_type: 'minus',
      title: '地面師詐欺',
      overview:
        'Netflixで話題の地面師。自分は引っかからないだろうと思っていたら簡単に引っかかる。10億円の被害にある。',
      src: 'event-36.png',
      value: 100000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '37',
    event: {
      id: '037',
      event_type: 'plus',
      title: '新規事業',
      overview:
        'ギャンブル講座の新規事業を始める。有名YouTuberに取り上げてもらい有名になり儲かる。 5000万円もらう。',
      src: 'event-37.png',
      value: 5000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '38',
    event: {
      id: '038',
      event_type: 'special',
      title: '特殊イベント ~家を買う~',
      overview:
        '3億円で豪邸を買う。数年後土地価格が上昇し高値で売れることになった。ダイスを振り、1~2が出れば1.5倍,3~4が出れば2倍、5~6が出れば3倍になる。',
      src: 'event-38.png',
      value: 0,
      special_event: {
        id: '13',
        conditions: ['1-2', '3-4', '4-6'],
        effect_type: '*/',
        effect_value: [1.5, 2, 3],
        base_amount: [30000, 1],
      },
    },
  },
  {
    id: '39',
    event: {
      id: '039',
      event_type: 'plus',
      title: '!!!!????',
      overview: 'ひょんなことから大金が手に入る。1億円もらう。',
      src: 'event-39.png',
      value: 10000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '40',
    event: {
      id: '040',
      event_type: 'special',
      title: '特殊イベント ~社会貢献~',
      overview:
        '急に社旗貢献したくなりユニセフに寄付をする。喜びに満ち溢れながら、所持金を賭けダイスを振る。1が出ると全額、2~3が出ると半額、4~6が出ると1/4を寄付する。',
      src: 'event-40.png',
      value: 0,
      special_event: {
        id: '14',
        conditions: ['1-1', '2-3', '4-6'],
        effect_type: '*/',
        effect_value: [0, 0.5, 0.25],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '41',
    event: {
      id: '041',
      event_type: 'plus',
      title: '大親友',
      overview: '大親友がそばにいる価値に気づく。1億円もらう。',
      src: 'event-41.png',
      value: 10000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '42',
    event: {
      id: '042',
      event_type: 'plus',
      title: '聖人登場',
      overview:
        '実は昔ヒカキンに恩を売っていて、当時のお返しを貰う。1億円もらう。',
      src: 'event-42.png',
      value: 10000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '43',
    event: {
      id: '043',
      event_type: 'plus',
      title: 'マスターの好意',
      overview: 'ゲームマスターの機嫌がよくなった。3億円もらう。',
      src: 'event-43.png',
      value: 30000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '44',
    event: {
      id: '044',
      event_type: 'plus',
      title: '愛する人との出会い',
      overview:
        '生涯愛する運命の人と出会う。気分がよくなりすべてがうまくいくようになった。4億円もらう',
      src: 'event-44.png',
      value: 40000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '45',
    event: {
      id: '045',
      event_type: 'special',
      title: '特殊イベント ~オールイン~',
      overview:
        '所持金のすべてを賭ける。ダイスを振り、1~3が出ると 全て を失い、4~6が出ると 2倍 になる。',
      src: 'event-45.png',
      value: 0,
      special_event: {
        id: '15',
        conditions: ['1-3', '4-6'],
        effect_type: '*/',
        effect_value: [0, 2],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '46',
    event: {
      id: '046',
      event_type: 'minus',
      title: '大暴落',
      overview: '必ず利益が出ると思っていた株が大暴落する。5億円の損失。',
      src: 'event-46.png',
      value: 50000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '47',
    event: {
      id: '047',
      event_type: 'minus',
      title: '火事',
      overview:
        'ネズミがブレイカーの配線を嚙みちぎり火花が発生し出火する。気づいたころには燃え広がり火事になる。5000万円の損失。',
      src: 'event-47.png',
      value: 5000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '48',
    event: {
      id: '048',
      event_type: 'plus',
      title: '株',
      overview: '持っていた株の価格が大幅に上がる。5億円もらう。',
      src: 'event-48.png',
      value: 50000,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
  {
    id: '49',
    event: {
      id: '049',
      event_type: 'special',
      title: '特殊イベント～破産～',
      overview:
        'ギャンブルに負け続け多額の借金を抱える。自己破産を申告し全財産を失う',
      src: 'event-49.png',
      value: 0,
      special_event: {
        id: '16',
        conditions: ['1-1', '2-3', '4-6'],
        effect_type: '*/',
        effect_value: [0, 0.5, 0.25],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '50',
    event: {
      id: '050',
      event_type: 'special',
      title: '特殊イベント ~ラストチャンス~',
      overview:
        '勝負はまだ終わっていない。ダイスを振り、1が出ると +50億円、2が出ると +10億円、3~4が出ると +3億円、5が出ると -10億円、6が出ると -50億円 にする。',
      src: 'event-50.png',
      value: 0,
      special_event: {
        id: '17',
        conditions: ['1-1', '2-2', '3-4', '5-5', '6-6'],
        effect_type: '+-',
        effect_value: [500000, 100000, 30000, -100000, -500000],
        base_amount: [0, 1],
      },
    },
  },
  {
    id: '51',
    event: {
      id: '051',
      event_type: 'goal',
      title: 'Goal',
      overview: '全くいい人生だった。',
      src: 'event-51.png',
      value: 0,
      special_event: {
        id: '0',
        conditions: ['0'],
        effect_type: '+-',
        effect_value: [0],
        base_amount: [0],
      },
    },
  },
];
