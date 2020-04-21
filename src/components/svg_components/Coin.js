import React from 'react'
import Svg, { LinearGradient, Stop, Ellipse, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const Coin = props => (
  <Svg {...props} viewBox="0 0 1000 1000">
    <LinearGradient
      id="prefix__a"
      gradientUnits="userSpaceOnUse"
      x1={931.075}
      y1={-77.694}
      x2={814.039}
      y2={-84.019}
      gradientTransform="matrix(1 0 0 -1 0 400)"
    >
      <Stop offset={0} stopColor="#f9ed32" />
      <Stop offset={0.27} stopColor="#fae330" />
      <Stop offset={0.73} stopColor="#fcca29" />
      <Stop offset={1} stopColor="#fdb724" />
    </LinearGradient>
    <LinearGradient
      id="prefix__b"
      gradientUnits="userSpaceOnUse"
      x1={138.493}
      y1={-99.896}
      x2={901.987}
      y2={-99.896}
      gradientTransform="matrix(1 0 0 -1 0 400)"
    >
      <Stop offset={0.3} stopColor="#ffc421" />
      <Stop offset={1} stopColor="#f99f28" />
      <Stop offset={1} stopColor="#f5d435" />
    </LinearGradient>
    <Ellipse
      cx={520.2}
      cy={499.9}
      rx={381.2}
      ry={437.9}
      fill="url(#prefix__a)"
      stroke="url(#prefix__b)"
      strokeMiterlimit={10}
    />
    <Ellipse cx={479.8} cy={500.1} rx={381.2} ry={437.9} fill="#f9ed32" />
    <LinearGradient
      id="prefix__c"
      gradientUnits="userSpaceOnUse"
      x1={153.82}
      y1={-115.84}
      x2={318.734}
      y2={-107.456}
      gradientTransform="matrix(1 0 0 -1 0 400)"
    >
      <Stop offset={0} stopColor="#ffd11d" />
      <Stop offset={1} stopColor="#f9ed32" />
    </LinearGradient>
    <Ellipse cx={463.3} cy={500.1} rx={321.3} ry={369} fill="url(#prefix__c)" />
    <LinearGradient
      id="prefix__d"
      gradientUnits="userSpaceOnUse"
      x1={171.293}
      y1={-99.896}
      x2={813.904}
      y2={-99.896}
      gradientTransform="matrix(1 0 0 -1 0 400)"
    >
      <Stop offset={0} stopColor="#f9ed32" />
      <Stop offset={0.07} stopColor="#faea30" />
      <Stop offset={0.61} stopColor="#fed822" />
      <Stop offset={1} stopColor="#ffd11d" />
    </LinearGradient>
    <Ellipse cx={492.6} cy={499.9} rx={321.3} ry={369} fill="url(#prefix__d)" />
    <LinearGradient
      id="prefix__e"
      gradientUnits="userSpaceOnUse"
      x1={298.774}
      y1={255.028}
      x2={662.082}
      y2={255.028}
      gradientTransform="scale(1 -1) rotate(-4.531 -8728.841 -73.996)"
    >
      <Stop offset={0} stopColor="#ffc421" />
      <Stop offset={0.66} stopColor="#f99f28" />
      <Stop offset={1} stopColor="#f5d435" />
    </LinearGradient>
    <Path
      fill="url(#prefix__e)"
      stroke="#f15a29"
      strokeWidth={2}
      strokeMiterlimit={10}
      d="M595 659.4l-112.9-64.2-95.5 55.2-16.9 9.8 20.6-137.8-91-97.5 125.6-21 56.2-125.4 57 124.9 125.7 20.1-90.4 98.2z"
    />
  </Svg>
)

export default Coin
