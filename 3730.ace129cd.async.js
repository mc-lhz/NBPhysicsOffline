(function(){var E=(M,y,k)=>new Promise((x,g)=>{var m=v=>{try{b(k.next(v))}catch(l){g(l)}},_=v=>{try{b(k.throw(v))}catch(l){g(l)}},b=v=>v.done?x(v.value):Promise.resolve(v.value).then(m,_);b((k=k.apply(M,y)).next())});(self.webpackChunkvirtuallab=self.webpackChunkvirtuallab||[]).push([[3730],{7285:function(M,y,k){"use strict";k.d(y,{L:function(){return g}});var x=k(28897);class g{static getCurrentLanguage(){return g.instance.language}static changeLocale(_){return g.instance.changeLanguage(_)}static init(_,b){return E(this,null,function*(){let v=b!=null?b:"zh",l=x.i.createInstance();yield l.use(x.B).init({lng:v,debug:!0,fallbackLng:[v],backend:{loadPath:_,crossDomain:!0}}),g.instance=l})}static t(_,b=null){return g.instance.t(_,b)}}},23730:function(M,y,k){"use strict";k.d(y,{C:function(){return l},E:function(){return L},F:function(){return v},S:function(){return D}});var x=k(23421),g=k(7285),m=k(71176),_=k(58959),b=k(55453);const v={SAVE:"PLAYER.EVENTS.SAVE",LOADED:"PLAYER.EVENTS.LOADED",HISTORY_UNDO:"PLAYER.EVENTS.HISTORY-UNDO",HISTORY_REDO:"PLAYER.EVENTS.HISTORY-REDO",CANVAS:{SELECTION_CHANGED:"PLAYER.EVENTS.CANVAS.SELECTION-CHANGED"},xxxxxxx:"PHY.LIB.xxxxxxxxx",CHECKED:"PHY.LIB.SCHEMFORM.CHECKED",DATA_CHANGED:"PHY.LIB.SCHEMFORM.DATA_CHANGED",PHYSICS_FORM_MODULE:{FORM_SETDATA:"phys.formModule.setData",FORM_CLEAR:"phys.formModule.clear",FORM_SETCHECKED:"phys.formModule.setChecked"},PHYSICS_EVENT:{ADD_CIRCUIT_DIAGRAM:"phys.setting.addCircuitDiagram",ADD_TABLE_COMP:"phys.setting.addTableComp",FRESH_LIBRARY_STATUS:"phy.freshLibraryStatus",CUR_SELECT_FALSE:"phy.curSelectFalse"},CREATE_FROM_PUB_LIB:"createFromPubLib",CREATE_FROM_EMPTY:"createFromEmpty",ADD_EQ:"addEq",SCALE_CHANGED:"scaleChanged",TO_TOP:"toTop",MIN_WINDOW:"minWindow",MAX_WINDOW:"maxWindow",VIEW_INIT_COMPLETE:"viewInitComplete",EQUIPMENT_CHANGE:"equipment_change"};class l{static getDoubleRadio(e,t,i){const s={type:l.DOUBLE_RADIO};return s.checked=t,s.labels=e,s.callBack=i,s}static getAngle(e,t,i,s){const n={type:l.ANGLE};return n.name=e,n.value=t,n.callBack=i,n.this=s,n}static getCheckBox(e,t,i,s){const n={type:l.CHECKBOX};return n.name=e,n.checked=t,n.callBack=i,n.this=s,l.createGSObj(n),n}static getTitle(e,t){const i={type:l.LABEL};return i.isTitle=!0,i.name=e,i.value=t,l.createGSObj(i),i}static getLabel(e,t){const i={type:l.LABEL};return i.name=e,i.text=t,l.createGSObj(i),i}static getScrollBar(e,t,i,s,n,o,p,r,h){const c={type:l.DRAG};if(c.name=e,c.canEnter=t,c.enterUnit=i,c.maxValue=s,c.minValue=n,c.step=p,p>0){let d=0;for(;p<1;)p*=10,d++;c.precision=d}return c.callBack=r,c.this=h,c.showValue=o,l.createGSObj(c),c}static getSwitch(e,t,i,s){const n={type:l.BOOL};return n.name=e,n.checked=t,n.callBack=i,n.this=s,l.createGSObj(n),n}static getDropMenu(e,t,i,s,n,o,p,r,h){const c={type:l.SELECT};return c.name=e,c.canEnter=t,c.enterUnit=i,c.maxValue=r,c.minValue=h,c.showValue=s,c.value=n,c.this=o,c.callBack=p,l.createGSObj(c),c}static getRadio(e,t,i,s,n=null){const o={type:l.RADIO};return o.name=e,o.checked=t,o.value=i,o.callBack=s,o.this=n,l.createGSObj(o),o}static getButton(e,t,i,s){const n={type:l.BUTTON};return n.name=e,n.text=t,n.callBack=i,n.this=s,n.value=1,l.createGSObj(n),n}static getTextInput(e,t,i,s,n,o=!1,p=null,r=null){const h={type:l.INPUT};return h.name=e,h.showValue=t,h.enterUnit=i,h.callBack=s,h.this=n,h.nofilter=!0,h.minValue=p,h.maxValue=r,l.createGSObj(h),h}static getDoubleInput(e,t,i,s,n){const o={type:l.DOUBLE_INPUT};return o.name=e,o.showValue={valueA:t,valueB:i},o.callBack=s,o.this=n,l.createGSObj(o),o}static getLabelInput(e,t,i,s,n=null,o=!1){const p={type:l.LABEL_INPUT};return p.name=e,p.showValue={valueA:t,valueB:i},p.callBack=s,p.this=n,p.isRevert=o,l.createGSObj(p),p}static getBatteryList(e,t,i,s,n){const o={type:l.TYPE_LIST_BATTERY_HOLDER};return o.name=e,o.value=t,o.checked=i,o.this=n,o.callBack=s,l.createGSObj(o),o}static getColorItem(e,t,i,s,n){const o={type:l.TYPE_COLOR_ITEM,name:e,checked:{colors:{direction:2,arr:[t[i]]},textureSelected:-1},arr:[]};return t.forEach((p,r)=>{o.arr.push({direction:0,index:r,arr:[p]})}),o.this=n,o.callBack=s.bind(n),o}static createGSObj(e){return e._callBack=e.callBack,e.callBack=null,e.hasOwnProperty("value")&&(e._value=e.value,Object.defineProperty(e,"value",{get(){return e._value},set(t){e._value=t,e._callBack&&(e.this?e._callBack.call(e.this,e):e._callBack(e))}})),e.hasOwnProperty("checked")&&(e._checked=e.checked,Object.defineProperty(e,"checked",{get(){return e._checked},set(t){e._checked=t,e._callBack&&(e.this?e._callBack.call(e.this,e):e._callBack(e))}})),e.hasOwnProperty("showValue")&&(e._showValue=e.showValue,Object.defineProperty(e,"showValue",{get(){return e._showValue},set(t){e._showValue=t,e.type===l.SELECT&&(e.checked=m.A.getIndexFromValue(e.value,e._showValue)),e._callBack&&(e.this?e._callBack.call(e.this,e):e._callBack(e))}})),e}}l.RADIO=1,l.CHECKBOX=2,l.SELECT=3,l.BOOL=4,l.INPUT=5,l.LABEL=6,l.DRAG=7,l.BUTTON=8,l.ANGLE=9,l.SCHEM=12,l.TEXT=13,l.DOUBLE_INPUT=14,l.DOUBLE_BUTTON=15,l.SIMULATED_ELECTRIC_FIELD=16,l.TYPE_LIST_BATTERY_HOLDER=17,l.TYPE_LIST_BATTERY=18,l.TYPE_LIST_WAX_BLOCK=19,l.TYPE_LIST_RULER=20,l.TYPE_COLOR_ITEM=21,l.LABEL_INPUT=23,l.DOUBLE_RADIO=30;class D{get themeNames(){return[g.L.t("param.lightTheme"),g.L.t("param.darkTheme")]}constructor(){this.themes=[{bgColor:"#FFFFFF",lineColor:"#000000",selectColor:"#FF7E30"},{bgColor:"#575D67",lineColor:"#E9E9E9",selectColor:"#FF7E30"}],this.type=0,this.theme=this.themes[this.type]}getConfArr(e){return[l.getDropMenu(g.L.t("param.theme"),!1,"",this.themeNames[this.type],this.themeNames,this,e,null,null)]}getData(){return{type:this.type}}setData(e){e&&this.setType(e.type)}setType(e){this.type=parseInt(e)||0,this.theme=this.themes[this.type]}getStyle(){return"<style>"+this.getCss()+"</style>"}getCss(){return`
.svg_stage{
  background-color: ${this.theme.bgColor};
}
/**\u9ED1\u8272\u7C97\u7EBF**/
.svg_line{
  fill:none;
  stroke:${this.theme.lineColor};
  stroke-width:28;
  stroke-miterlimit:10;
}

/**\u9ED1\u8272\u586B\u5145\uFF0C\u90A3\u4E9B\u6587\u5B57**/
.svg_fill_black{
  opacity:1.0;
  fill:${this.theme.lineColor};
}

/**\u706F\u6CE1\u9EC4\u8272\u586B\u5145**/
.svg_fill_yellow{
  opacity:0;
  fill: #FFF100;
}

.svg_elec_comp{
  cursor: move;
}

/**\u5668\u6750\u80CC\u666F\u77E9\u5F62**/
.svg_elec_comp_bg{
  fill: rgba(248,123,48,0.3);
  stroke:none;
  stroke-miterlimit:10;
  opacity: 0;
}

/**\u5668\u6750\u78B0\u649E\u7EA2\u8272\u77E9\u5F62\u6846**/
.svg_red_rect{
  stroke: rgba(255, 0, 0, 1.0);
  stroke-width:14;
  fill: rgba(255,0,0,0.3);
}

/**\u5668\u6750\u63A5\u7EBF\u67F1\u4E0E\u81EA\u7531\u63A5\u7EBF\u67F1-\u5C0F\u65B9\u5757**/
.svg_binding_post>.svg_post_rect,.svg_free_post>.svg_post_rect{
  stroke:#ff7e30;
  stroke-width:40;
  stroke-miterlimit:10;
  fill: rgba(0, 0, 0, 0);
  stroke-opacity:0;
}

/**\u5BFC\u7EBF\u63A5\u7EBF\u67F1**/
.svg_wire_post{
  stroke-opacity:1.0;
  stroke-width:14;
  stroke: rgba(255, 126, 48, 1);
  fill: rgba(255, 126, 48, 1);
  cursor: pointer;
}

/**\u63A5\u7EBF\u67F1-\u5C0F\u5706\u70B9**/
.svg_binding_post .svg_post_circle{
  fill: ${this.theme.lineColor};
  cursor:pointer;
}

/**\u5BFC\u7EBF\u6837\u5F0F**/
.svg_elec_wire{
  fill:none;
  stroke: ${this.theme.lineColor};
  stroke-width:28;
  stroke-linecap: square;
  cursor: pointer;
}

/**\u5BFC\u7EBF\u4E0A\u7535\u6D41\u6837\u5F0F**/
.svg_elec_wire_current{
  stroke: ${this.theme.selectColor};
  stroke-width: 56;
  fill: none;
  stroke-linecap: round;
  stroke-dasharray : 0, 150; // \u865A\u7EBF\u957F0, \u95F4\u8DDD150
}

/**\u5BFC\u7EBF\u70B9\u51FB\u533A\u57DF**/
.svg_elec_wire_hitarea{
  stroke: #FF0000;
  stroke-width: 256;
  fill: none;
  stroke-linecap: square;
  opacity: 0.0;
}

/**\u7F51\u683C\u6837\u5F0F**/
.svg_grid{
  fill:none;
  stroke:rgba(0, 0, 0, 0.3);
  stroke-width:14;
  stroke-linecap: square;
  pointer-events: none
}

/**\u5F00\u5173\u6837\u5F0F(\u6253\u5F00)**/
.svg_switch_line{
  transform: rotate(-30deg);
  cursor:pointer;
}
/**\u5F00\u5173\u6837\u5F0F(\u95ED\u5408)**/
.svg_switch_line_close{
  transform: rotate(30deg);
  cursor:pointer;
}

/**\u5F00\u5173\u7684\u70B9\u51FB\u533A\u57DF**/
.svg_click_area{
  fill: rgba(0, 0, 0, 0);
  cursor: pointer
}

/**\u5BF9\u9F50\u7EBF**/
.svg_align_line{
  fill:none;
  stroke: rgba(255,242,36,0.3);
  stroke-width:1024;
}

/**\u6807\u7B7E\u6837\u5F0F**/
.svg_label{
  stroke: ${this.theme.lineColor};
  fill: ${this.theme.lineColor};
  font-size: 256px;
  text-anchor: middle;  /* \u6587\u672C\u6C34\u5E73\u5C45\u4E2D */
  dominant-baseline: middle; /* \u6587\u672C\u5782\u76F4\u5C45\u4E2D */
}
/**\u6807\u7B7E\u4E0B\u6807\u6837\u5F0F**/
.svg_label_sub{
  font-size: 128px;
  baseline-shift: -50%;
}

/**\u7535\u8868\u7684\u6807\u7B7E**/
.svg_label_meter{
  font-size: 300px; !important;
  text-anchor: start;  /* \u6587\u672C\u6C34\u5E73\u5C45\u5DE6 */
  font-weight: bold;
  stroke: ${this.theme.lineColor};
  fill: ${this.theme.lineColor};
}

/**\u81EA\u7531\u63A5\u7EBF\u67F1\u6837\u5F0F**/
.svg_free_post{
  cursor: pointer;
}
.svg_free_post .svg_post_circle{
  fill: ${this.theme.lineColor};
}

/**________________________\u7279\u6B8A\u6837\u5F0F\uFF0C\u6BD4\u5982\u706F\u6CE1\u5F00\u5173_________________________**/

/**\u706F\u6CE1\u6837\u5F0F**/
.svg_bulb_light_up .svg_fill_yellow{
  opacity: 1.0;
}

/**\u5355\u5200\u5355\u63B7\u5F00\u5173\u95ED\u5408\u6837\u5F0F**/
.svg_switch_close .svg_switch_line{
  transform: rotate(-1deg);
}

/**\u5355\u5200\u53CC\u63B7\u5F00\u5173\u95ED\u5408\u6837\u5F0F**/
.svg_double_switch_close_1 .svg_double_switch_line{
  transform: rotate(-30deg);
}

.svg_double_switch_close_2 .svg_double_switch_line{
  transform: rotate(30deg);
}

/**\u4E8C\u6781\u7BA1\u7684\u5149**/
.LED .light,
.Diode .light{
  display: none;
}
.svg_led .light{
  display: block;
}

.svg_led_light .light
{
  stroke: ${this.theme.selectColor};
}

/**________________________\u6ED1\u52A8\u53D8\u963B\u5668\u6837\u5F0F________________________**/
.svg_slide_rheostat_type_0 {

}

.svg_slide_rheostat_type_1 .svg_line_left{
  display: none;
}

.svg_slide_rheostat_type_2 .svg_line_right{
  display: none;
}

/**________________________\u9F20\u6807\u79FB\u4E0A\u53BB\u6837\u5F0F_________________________**/

/**\u9F20\u6807\u79FB\u5230\u5668\u6750\u4E0A\uFF0C\u5668\u6750\u80CC\u666F\u6837\u5F0F**/
.svg_elec_comp:hover .svg_elec_comp_bg{
  opacity: 1.0;
}

/**\u9F20\u6807\u79FB\u5230 \u5668\u6750\u63A5\u7EBF\u67F1|\u81EA\u7531\u63A5\u7EBF\u67F1 \u4E0A**/
.svg_binding_post:hover >.svg_post_rect,.svg_free_post:hover >.svg_post_rect{
  stroke-opacity:1.0;
}

/**________________________\u9009\u4E2D\u6837\u5F0F_________________________**/

/**\u5668\u6750\u9009\u4E2D\uFF0C\u5668\u6750\u80CC\u666F\u6837\u5F0F**/
.svg_elec_comp_select .svg_elec_comp_bg{
  opacity: 0.0;
}

/**\u5668\u6750\u9009\u4E2D\u6837\u5F0F**/
.svg_elec_comp_select .svg_line,
.svg_elec_comp_select .svg_switch_line,
.svg_elec_comp_select .svg_double_switch_line {
  stroke: ${this.theme.selectColor};
}

.svg_elec_comp_select .svg_fill_black,
.svg_elec_comp_select .svg_text_meter,
.svg_label_meter_select
/*.svg_elec_comp_select .svg_label*/
/*.svg_label_select*/
{
  fill: ${this.theme.selectColor};
  stroke: ${this.theme.selectColor};
}

.svg_binding_post_select, .svg_binding_post_comp_select{
  opacity:1.0;
}

.svg_elec_comp_select .svg_binding_post{
  opacity:1.0;
}

/**\u5BFC\u7EBF\u9009\u4E2D**/
.svg_elec_wire_select{
  stroke: ${this.theme.selectColor};
}

/**\u5BFC\u7EBF\u9009\u4E2D\uFF0C\u7535\u6D41\u6837\u5F0F**/
.svg_elec_wire_select .svg_elec_wire_current{
  stroke: ${this.theme.selectColor};
  stroke-width: 70;
  stroke-dasharray : 0, 150;
}

/**\u81EA\u7531\u63A5\u7EBF\u67F1\u9009\u4E2D\u6837\u5F0F**/
.svg_free_post_select .svg_post_circle{
  fill: ${this.theme.selectColor};
}

/** ----------------\u5BFC\u51FA\u56FE\u7247----------------- **/
.svg_export_png .svg_fill_yellow{
  opacity: 0.0!important;
}

.svg_export_png .svg_elec_wire_current{
  opacity: 0.0!important;
}

/**\u70B9\u51FB\u533A\u57DF**/
.svg_hitarea{
  stroke: none;
  fill: #000000;
  fill-opacity: 0.0;
}

/**\u7981\u7528\u9F20\u6807\u4E8B\u4EF6**/
.svg_disabled{
  pointer-events: none
}

/**\u9690\u85CF**/
.svg_hide{
  display: none;
}
`}}class A{constructor(e){this.editPage=e,this.svgMain=this.editPage.svgMain}get config(){var e;return(e=this.editPage)===null||e===void 0?void 0:e.config}show(){var e,t,i;const s=this.editPage.compMain.windowRect,n=s.x+s.width-203,o=s.y-10,p={openSecond:!0,childRect:{left:n,top:o,width:0},target:this,canMin:!1,canShowCurrent:!0,showCurrentFlag:this.svgMain.showCurrent,canDownload:!0,canSave:!0,canToSchem:!1,canToElecs:!1,placement:"top",confArr:[]},r=p.confArr,h=l.getTextInput(g.L.t("param.circuitDiagramName"),this.editPage.title,"",c=>{let d=c.showValue+"",u=this.hasChina(d)?32:128;d.length>u&&(d=d.substr(0,u)),this.editPage.title=d},this,!0);h.keyboardEnable=!1,r.push({type:l.LABEL,name:g.L.t("param.circuitDiagramName"),value:this.editPage.title,isTitle:!0}),((e=this.config)===null||e===void 0?void 0:e.settingTitleNoEdit)?r.push({type:l.LABEL,name:g.L.t("param.name"),value:g.L.t("editPage.defaultName")}):r.push(h),g.L.getCurrentLanguage()==="zh"&&!((t=this.config)===null||t===void 0?void 0:t.settingExportHidden)&&r.push(l.getDropMenu(g.L.t("param.exportMode"),!1,"",this.editPage.exportModeLists[this.editPage.exportMode],this.editPage.exportModeLists,this,c=>{this.editPage.exportMode=c.checked?1:0},null,null),l.getSwitch(g.L.t("param.exportWithBackground"),this.editPage.expBgFlag,c=>{this.editPage.expBgFlag=c.checked},this)),r.push(l.getSwitch(g.L.t("param.showCurrent"),this.svgMain.showCurrent,c=>{this.svgMain.showCurrent=c.checked,this.show()},this)),this.svgMain.showCurrent&&r.push({type:30,name:g.L.t("param.type"),value:[g.L.t("param.durrentDir"),g.L.t("param.dlectronDir")],checked:this.svgMain.currentType,className:"radioGroup3d",callBack:c=>{this.svgMain.currentType=c.checked}}),((i=this.config)===null||i===void 0?void 0:i.settingExportHidden)||r.push({type:31,value:g.L.t("editPage.download"),callBack:()=>{this.editPage.download()}}),r.push(l.getSwitch(g.L.t("param.wireCrossAlert"),this.svgMain.showCrossTip,c=>{this.svgMain.showCrossTip=c.checked,this.svgMain.reCalculateAllWire()},this),l.getSwitch(g.L.t("param.showLabel"),this.svgMain.showLabel,c=>{this.editPage.setShowLabel(c.checked)},this),l.getRadio(g.L.t("param.switchStyle"),this.svgMain.isOldStandard?1:0,this.svgMain.switchStyleArr,c=>{this.svgMain.freshStandardSkin(c.checked===1)}),l.getSwitch(g.L.t("param.showGrid"),this.svgMain.showGrid,c=>{this.editPage.setShowGrid(c.checked)},this),...this.editPage.style.getConfArr(c=>{this.editPage.style.setType(c.checked),this.editPage.styleChanged()})),_.E.emit(v.PHYSICS_EVENT.FRESH_LIBRARY_STATUS,p),console.log("*****\u7535\u8DEF\u56FE\u5C5E\u6027: ",p)}hasChina(e){return/.*[\u4e00-\u9fa5]+.*/.test(e)}}class T{static sort(e){this.svgMain=e,this.loopNum=0;const t=this.loopSort();return this.preSetType=-1,t}static loopSort(){const e=this.svgMain;let t=null;const i=e.getAllComps();return!t&&this.preSetType!==1&&(t=this.sortEquipmentWires([...i])),!t&&this.preSetType!==3&&(t=this.serialEquipmentSameY([...i])),!t&&this.preSetType!==4&&(t=this.sliderPosOpt([...i])),!t&&this.preSetType!==5&&(t=this.optmzdNode(e)),t?(this.preSetType=t.type,this.printTip(t),this.loopSort(),!0):!1}static printTip(e){const t={1:"\u5BFC\u7EBF\u7A7F\u8FC7\u5668\u6750",2:"\u5BFC\u7EBF\u4EA4\u53C9",3:"\u4E32\u8054\u5668\u6750\u7EB5\u5750\u6807\u4E00\u81F4",4:"\u4F18\u5316\u6ED1\u52A8\u53D8\u963B\u5668\u4F4D\u7F6E",5:"\u4F18\u5316\u8282\u70B9"};console.log(`~~~~~~\u6210\u529F\u5904\u7406-${e.type}\u3001${t[e.type]}: ${e.tip}`)}static sortEquipmentWires(e){var t,i;for(let s of e){const n=s.posts;if(n.length!==2)return!1;const o=m.M.getSPPoint(n[0]),p=m.M.getSPPoint(n[1]),r=[];let h=!1;if(n.forEach((c,d)=>{const u=this.getLinkPostsFromPosts(c.postData);u.length>0&&u.forEach(f=>{var w;const P=(w=f.views)===null||w===void 0?void 0:w[0];if(!P)return;const S=P.elecComp;if(!S)return;const C=S.vertices;this.checkWireCrossingComponents(C,o,p)?(s.rotate(),s.rotate(),h=!0):r[d]=C})}),h)return{type:1,tip:this.getLabel(s)};if(((t=r==null?void 0:r[0])===null||t===void 0?void 0:t.length)&&((i=r==null?void 0:r[1])===null||i===void 0?void 0:i.length)&&this.isSegmentIntersect(r[0],r[1]))return s.rotate(),s.rotate(),{type:2,tip:this.getLabel(s)}}return null}static serialEquipmentSameY(e){const t=[],i=[...e];for(;i.length;){const s=i.pop();if(s.rotation!==0&&s.rotation!==180)continue;let n,o;s.posts[0].x<s.posts[1].x?(n=s.posts[0],o=s.posts[1]):(n=s.posts[1],o=s.posts[0]);const p=this.getSerialComps(n,0),r=this.getSerialComps(o,1),h=[...p.reverse(),s,...r];m.A.removeArrayFromArray(i,h),t.push(h)}for(let s of t){const n=s[0].posts[0].y;let o=null;if(s.forEach((p,r)=>{if(r===0)return;const h=p.posts[0].y-n;h!==0&&(p.y-=h,p.updateTransform()),!o&&h!==0&&(o={type:3,tip:this.getLabel(s)})}),o)return o}return null}static sliderPosOpt(e){var t;const i=this.svgMain,s=e.filter(o=>o.className==="SlideRheostat"||o.className==="SlideRheostat2"&&o.rotation===0);let n=[];for(let o of s){const p=this.getLinkPostsFromPosts(o.posts[2].postData);if(p.length!==1)continue;const r=(t=p[0].views)===null||t===void 0?void 0:t[0];if(!r)continue;const h=this.getAnotherPost(r);if(h.y<=r.y)continue;const c=new m.P(r.x+i.CW*2,r.y);r.elecComp.updateTransform({p0:h,p1:c,cacuVers:u=>{u.push(m.M.getSPPoint(r))}}),n.push(this.getLabel(o))}return n.length?{type:4,tip:n.join(",")}:null}static optmzdNode(e){const t=e.getAllWires();for(;t.length;){const i=t.pop(),s=i.getUniqVertices();if(!!s[0])for(let n of i.posts){if(!n)continue;(s[0].x!==n.x||s[0].y!==n.y)&&s.reverse();let o=[];if(this.getLinkPostsFromPosts(n.postData).map(p=>{const r=p.views[0];(r==null?void 0:r.isWirePost)&&o.push(r)}),!!o.length)for(let p of o){const r=p.elecComp,h=r.getUniqVertices();if(!h[0]||((h[0].x!==p.x||h[0].y!==p.y)&&h.reverse(),!s[0]||!s[1]||!h[1])||m.M.getAngleByP(s[0],s[1],h[1])!==0)continue;const d=this.findFirstTurn(s),u=this.findFirstTurn(h);let f;if(d&&u)m.M.getPointLen(s[0],d)<m.M.getPointLen(s[0],u)?f=d:f=u;else if(d)m.M.getPointLen(s[0],d)<m.M.getPointLen(s[0],h[h.length-1])?f=d:f=h[h.length-1];else if(u)m.M.getPointLen(s[0],s[s.length-1])<m.M.getPointLen(s[0],u)?f=s[s.length-1]:f=u;else continue;let w=this.getPost(f);w||(w=this.svgMain.addEq("FreePostComp",f).post);const P=s[0].equals(r.post0)?r.post0:r.post1,S=this.getCompDBData(n);w.addFollower(n),w.addFollower(P),i.routedByUserInteraction=!1,i.updateTransform(),r.routedByUserInteraction=!1,r.updateTransform();const C=this.svgMain.addEq("ElecWire",new m.P);return S.addFollower(C.post0),w.addFollower(C.post1),C.updateTransform(),this.svgMain.deleteFreePost(),{type:5,tip:""}}}}return null}static findFirstTurn(e){function t(i,s){return s.x-i.x==0?Infinity:(s.y-i.y)/(s.x-i.x)}for(let i=2;i<e.length;i++)if(t(e[i-2],e[i-1])!==t(e[i-1],e[i]))return e[i-1];return null}static getPost(e){const t=[],i=[];for(let s of this.svgMain.children)s.isPost?t.push(s):s.isFreePost&&i.push(s);for(let s of t)if(m.M.getPointLen(s,e)<200)return s;for(let s of i)if(m.M.getPointLen(s,e)<200)return s;return null}static getAllPost(){return this.svgMain.children.filter(e=>e.isFreePost||e.isCompPost)}static getLabel(e){if(Object.prototype.toString.call(e)==="[object Array]"){let t="";return e.forEach((i,s)=>{t+=`${i.label.text||i.className}${i.label.text?i.label.subText:""}`,s<e.length-1&&(t+="-")}),t}return`${e.label.text||e.className}${e.label.subText}`}static getSerialComps(e,t){const i=[];let s=e.postData;const n={};for(n[+s.UID]=!0;;){const o=this.getSerialLinkOne(s);if(!o)return i;const{near:p,far:r}=o;if(!r||r.views.length!==1||n[+r.UID])break;if(!p||p.views.length!==1)break;{const h=s.views[0],c=p.views[0],d=r.views[0];let u=!0;if(t===0?(d.x>c.x&&(u=!1),c.x>h.x&&(u=!1)):t===1&&(d.x<c.x&&(u=!1),c.x<h.x&&(u=!1)),u)i.push(r.views[0].elecComp),s=r,n[+s.UID]=!0;else break}}return i}static getSerialLinkOne(e){var t,i,s,n;const o=this.getLinkPostsFromPosts(e);if(o.length!==1)return null;const p=o[0].brother,r=this.getLinkPostsFromPosts(p);if((r==null?void 0:r.length)!==1||((i=(t=r==null?void 0:r[0])===null||t===void 0?void 0:t.views)===null||i===void 0?void 0:i.length)!==1)return null;const h=(n=(s=r[0].views[0])===null||s===void 0?void 0:s.elecComp)===null||n===void 0?void 0:n.rotation;if(h!==0&&h!==180)return null;const c=this.getAnotherPost(r[0].views[0]);return{near:r[0],far:c==null?void 0:c.postData}}static getAnotherPost(e){var t;const i=(t=e==null?void 0:e.elecComp)===null||t===void 0?void 0:t.posts;return(i==null?void 0:i.length)!==2?null:i[0]===e?i[1]:i[0]}static isIntersect(e,t,i,s){function n(c,d,u){return(d.x-c.x)*(u.y-c.y)-(d.y-c.y)*(u.x-c.x)}let o=n(e,t,i),p=n(e,t,s),r=n(i,s,e),h=n(i,s,t);return(o>0&&p<0||o<0&&p>0)&&(r>0&&h<0||r<0&&h>0)}static areLinesCollinear(e,t,i,s){let n={x:t.x-e.x,y:t.y-e.y},o={x:s.x-i.x,y:s.y-i.y};return n.x*o.y-n.y*o.x===0}static isSegmentIntersect(e,t){let i=this.getLineSegments(e),s=this.getLineSegments(t);for(let n of i)for(let o of s)if(this.isIntersect(n[0],n[1],o[0],o[1]))return!0;return!1}static getLineSegments(e){let t=[],i=0;for(let s=0;s<e.length-1;s++)this.crossProduct(e[i],e[s],e[s+1])!==0&&(s>i&&t.push([e[i],e[s]]),i=s);return i<e.length-1&&t.push([e[i],e[e.length-1]]),t}static crossProduct(e,t,i){return(t.x-e.x)*(i.y-e.y)-(t.y-e.y)*(i.x-e.x)}static checkWireCrossingComponents(e,t,i){for(let s=0;s<e.length-1;s++){let n=s+1;for(;n<e.length&&this.crossProduct(e[s],e[n],t)===0;)n++;if(m.M.checkInLineAB(t,e[s],e[n-1])&&m.M.checkInLineAB(i,e[s],e[n-1]))return!0}return!1}static getCompDBData(e){const t=this.getLinkPostsFromPosts(e.postData);for(let i of t){const s=i==null?void 0:i.views[0];if((s==null?void 0:s.isCompPost)||(s==null?void 0:s.isFreePost))return s}return null}static getLinkPostsFromPosts(e){let t=e.next,i=[];for(;t&&t!==e;)t.views.length>0&&i.push(t),t=t.next;return i}}T.loopNum=0,T.preSetType=-1;const B=".scroll-y-1::-webkit-scrollbar-track{background-color:rgba(0, 0, 0, 0)}.scroll-y-1::-webkit-scrollbar{width:4px;background-color:transparent}.scroll-y-1::-webkit-scrollbar-thumb{background-color:#343940;border-radius:2px}.back_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -169px;width:30px;height:24px}.back_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -198px;width:30px;height:24px}.back_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -227px;width:30px;height:24px}.celan_shouqi_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1097px;width:17px;height:58px}.celan_shouqi_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1160px;width:17px;height:58px}.celan_zhankai_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1223px;width:17px;height:58px}.celan_zhankai_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1286px;width:17px;height:58px}.celan_zhankai_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1349px;width:17px;height:58px}.lib_close{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1412px;width:26px;height:80px}.lib_open{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1497px;width:26px;height:80px}.popup_clear_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -256px;width:24px;height:24px}.popup_clear_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -285px;width:24px;height:24px}.popup_dianliu_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -314px;width:30px;height:24px}.popup_dianliu_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -343px;width:30px;height:24px}.popup_dianliu_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -372px;width:30px;height:24px}.popup_guanbi_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -401px;width:30px;height:24px}.popup_guanbi_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -430px;width:30px;height:24px}.popup_guanbi_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -459px;width:30px;height:24px}.popup_houtui_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -488px;width:30px;height:24px}.popup_houtui_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -517px;width:30px;height:24px}.popup_houtui_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -546px;width:30px;height:24px}.popup_more_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -575px;width:30px;height:24px}.popup_more_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -604px;width:30px;height:24px}.popup_more_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -633px;width:30px;height:24px}.popup_qianjin_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -662px;width:30px;height:24px}.popup_qianjin_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -691px;width:30px;height:24px}.popup_qianjin_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -720px;width:30px;height:24px}.popup_quanjushezhi_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -749px;width:30px;height:24px}.popup_quanjushezhi_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -778px;width:30px;height:24px}.popup_quanjushezhi_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -807px;width:30px;height:24px}.popup_shengchengqicai_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -836px;width:30px;height:24px}.popup_shengchengqicai_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -865px;width:30px;height:24px}.popup_shengchengqicai_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -894px;width:30px;height:24px}.popup_xiazai_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -923px;width:30px;height:24px}.popup_xiazai_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -952px;width:30px;height:24px}.popup_xiazai_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -981px;width:30px;height:24px}.popup_zuixiaohua_def{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1010px;width:30px;height:24px}.popup_zuixiaohua_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1039px;width:30px;height:24px}.popup_zuixiaohua_pre{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -1068px;width:30px;height:24px}.resize{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px 0px;width:14px;height:14px}.vcenter_arrange_default{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -19px;width:20px;height:20px}.vcenter_arrange_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -44px;width:20px;height:20px}.vcenter_pos_default{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -69px;width:20px;height:20px}.vcenter_pos_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -94px;width:20px;height:20px}.vcenter_toelec_default{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -119px;width:20px;height:20px}.vcenter_toelec_hov{background-image:url(assets/schem/schem_globals_sprite.png);background-size:30px 1577px;background-repeat:no-repeat;background-position:0px -144px;width:20px;height:20px}.resizeCon .svgStyleCon{display:none}.resizeCon .resizeBtn{position:absolute;bottom:0;right:0;margin:5px;cursor:pointer;opacity:0.3}.resizeCon .resizeBtn:hover{opacity:1}";let L=class{constructor(a){(0,x.r)(this,a),this.editPageCloseEvent=(0,x.c)(this,"editPageCloseEvent",7),this.toLibraryPageEvent=(0,x.c)(this,"toLibraryPageEvent",7),this.minWinEvent=(0,x.c)(this,"minWinEvent",7),this.menuToElecEvent=(0,x.c)(this,"menuToElecEvent",7),this.windowRect={x:200,y:100,width:850,height:500},this.expBgFlag=!1,this.exportMode=0,this.style=new D,this.editPanel=null,this.eqLibData=b.A.eqLibData,this.compMain=void 0,this.config=void 0,this.canConvert=!0,this.state=0,this.title=void 0,this.title=`${g.L.t("libPage.title")}${L.addSchemInd++}`}getStyle(){return E(this,null,function*(){return this.style})}get exportModeLists(){return[g.L.t("param.fullDocument"),g.L.t("param.minimumImage")]}detectChanges(){this.state=Math.random()}componentDidLoad(){return E(this,null,function*(){this.editPanel=(0,_.d)(this.ele,"edit-panel"),this.svgMain=this.editPanel.svgMain,this.svgMain.detectChanges=this.detectChanges.bind(this),this.windowRect=this.compMain.windowRect,this.addListeners(),this.styleChanged(),this.detectChanges(),setTimeout(()=>{this.svgMain&&this.svgMain.windowSizeChanged();const a=(0,_.d)(this.ele,"eq-lib");a&&a.detectChanges()},100)})}addListeners(){_.E.addEventListener(v.SCALE_CHANGED,()=>{this.updatePercent()})}disconnectedCallback(){return E(this,null,function*(){_.R.removeDomResize(this.resizeId),_.D.removeDomDrag(this.dragId),_.D.removeDomDrag(this.dragId2)})}checkAndMoveOut(){var a;let e={},t=(a=this.config)===null||a===void 0?void 0:a.rectPadding;t=Object.assign({left:10,top:10,right:20,bottom:20},t),this.windowRect.x<t.left?e.x=t.left:this.windowRect.x+this.windowRect.width>window.innerWidth-t.right&&(e.x=window.innerWidth-this.windowRect.width-t.right),this.windowRect.y<t.top?e.y=t.top:this.windowRect.y+this.windowRect.height>window.innerHeight-t.bottom&&(e.y=window.innerHeight-this.windowRect.height-t.bottom),(e.x>0||e.y>0)&&TweenMax.to(this.windowRect,.2,Object.assign(Object.assign({},e),{onUpdate:()=>{this.detectChanges()}}))}windowSizeChanged(){return E(this,null,function*(){var a;this.svgMain&&this.svgMain.windowSizeChanged();const e=(a=this.compMain)===null||a===void 0?void 0:a.windowRect;if(e){const i=yield this.getNBPanelDom().getRect();e.x=i.x,e.y=i.y,e.width=i.width,e.height=i.height}})}getData(){return E(this,null,function*(){const a=this.svgMain,e=a.getData();return{title:this.title,exportBg:this.expBgFlag,exportMode:this.exportMode,showCurrent:a.showCurrent,showLabel:a.showLabel,showGrid:a.showGrid,style:this.style.getData(),data:e}})}setData(a){return E(this,null,function*(){this.expBgFlag=!!a.exportBg,this.exportMode=a.exportMode||0,this.title=a.title||this.title,this.svgMain.showCurrent=!!a.showCurrent,this.svgMain.setData(a.data),this.style.setData(a.style),this.styleChanged()})}styleChanged(){const a=(0,_.d)(this.ele,".svgStyleCon");a.innerHTML=this.style.getStyle()}autoAdjustEventHandle(){this.svgMain.adapt(),this.updatePercent(),b.A.seCompBox.emitBtnEvent({module_name:"\u7535\u8DEF\u56FE\u8BE6\u60C5",button_name:"\u5C45\u4E2D"})}arrangeEventHandler(){T.sort(this.svgMain)&&this.svgMain.addUndoMark(),b.A.seCompBox.emitBtnEvent({module_name:"\u7535\u8DEF\u56FE\u8BE6\u60C5",button_name:"\u4E00\u952E\u6574\u7406"})}updatePercent(){(0,_.d)(this.ele,"bottom-tool-bar").setPercent(this.svgMain.scalePercent)}backHandler(){this.toLibraryPageEvent.emit({UID:this.compMain.UID})}undoHandler(){this.svgMain.undo()&&this.detectChanges()}redoHandler(){this.svgMain.redo()&&this.detectChanges()}clearHandler(){if(b.A.seCompBox.emitBtnEvent({module_name:"\u7535\u8DEF\u56FE\u8BE6\u60C5",button_name:"\u5220\u9664"}),this.svgMain.curElec){this.svgMain.removeCurElec();return}this.svgMain.clear()}toSchem(){const{canvasMain:a}=this.config;a&&(b.A.phyToCircuit.convert(a,this.svgMain),this.updatePercent())}toElec(){return E(this,null,function*(){var a;if(!((a=this.svgMain)===null||a===void 0?void 0:a.hasChildren))return;const{canvasMain:t}=this.config;t&&b.A.circuitToPhy.convert(t,this.svgMain,()=>{t.showAllEquipments()})})}toElecHandler(){var a;this.menuToElecEvent.emit({UID:(a=this.compMain)===null||a===void 0?void 0:a.UID}),b.A.seCompBox.emitBtnEvent({module_name:"\u7535\u8DEF\u56FE\u8BE6\u60C5",button_name:"\u8F6C\u5B9E\u7269\u56FE"})}rightBtnClick(a){var e;switch((e=a.detail)===null||e===void 0?void 0:e.type){case"min":this.minWin();break;case"close":this.editPageCloseEvent.emit({UID:this.compMain.UID});break;case"circut":this.showCurrent();break;case"setting":this.svgMain&&this.showConf();break;case"download":this.download();break}}minWin(){this.hideConf(),this.minWinEvent.emit()}showCurrent(){this.onShowCurrent(!this.svgMain.showCurrent)}onShowCurrent(a){this.svgMain.showCurrent=a}showConf(){new A(this).show()}hideConf(){_.E.emit(v.PHYSICS_EVENT.FRESH_LIBRARY_STATUS,null)}download(){console.log("\u5BFC\u51FA\u7535\u8DEF\u56FE"),this.svgMain.exportPNG(this.exportMode,this.expBgFlag)}setShowLabel(a){this.svgMain.setShowLabel(this.getShowFlag(a))}setShowGrid(a){this.svgMain.setShowGrid(this.getShowFlag(a))}getShowFlag(a){return a===void 0?!0:!!a}panelCloseHandle(a){console.log(a)}startDrag(a){if(a.touches){const t=a.touches[0];a.clientX=t.clientX,a.clientY=t.clientY}(0,_.d)(this.ele,"nb-panel").startDrag(a)}sizeChangehandle(){const a=(0,_.d)(this.ele,"eq-lib");a&&a.detectChanges(),this.windowSizeChanged(),this.detectChanges()}getNBPanelDom(){return(0,_.d)(this.ele,"nb-panel")}render(){var a,e;const t={left:this.windowRect.x+"px",top:this.windowRect.y+"px",width:this.windowRect.width+"px",height:this.windowRect.height+"px"};return(0,x.h)("nb-panel",{class:"resizeCon",panelZIndex:500,x:t.left,y:t.top,width:t.width,height:t.height,closeVisible:!1,canResize:!0,overFlowHidden:!0,onSizeChange:()=>this.sizeChangehandle(),onMoveChange:()=>this.sizeChangehandle()},(0,x.h)("div",{slot:"panel-body",id:"panel-body"},(0,x.h)("div",{class:"svgStyleCon"}),(0,x.h)("div",{class:"editPage"},(0,x.h)("edit-panel",{compMain:this.compMain}),(0,x.h)("eq-lib",{eqLibData:this.eqLibData,compMain:this.compMain}),(0,x.h)("top-bar",{config:this.config,title:this.title,canUndo:(a=this.svgMain)===null||a===void 0?void 0:a.canUndo,canRedo:(e=this.svgMain)===null||e===void 0?void 0:e.canRedo,onBackEvent:()=>this.backHandler(),onUndoEvent:()=>this.undoHandler(),onRedoEvent:()=>this.redoHandler(),onClearEvent:()=>this.clearHandler(),onRightBtnClick:i=>this.rightBtnClick(i),onMove:i=>this.startDrag(i.detail)}),(0,x.h)("bottom-tool-bar",{canConvert:this.canConvert,onAutoAdjustEvent:()=>this.autoAdjustEventHandle(),onArrangeEvent:()=>this.arrangeEventHandler(),onToElecEvent:()=>this.toElecHandler()})),(0,x.h)("div",{class:"resizeBtn resize"})))}get ele(){return(0,x.g)(this)}};L.addSchemInd=1,L.style=B}}]);
})()