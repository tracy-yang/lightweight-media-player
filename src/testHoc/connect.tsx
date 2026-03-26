// import store from './redux/store'
// import { ReactReduxContext } from './Context'
// import { useContext } from 'react'
// function connect(mapStateToProps){
//    /* 第一层： 接收订阅state函数 */
//     return function wrapWithConnect (WrappedComponent){
//         /* 第二层：接收原始组件 */
//         function ConnectFunction(props){
//             const [ , forceUpdate ] = useState(0)
//             const { reactReduxForwardedRef ,...wrapperProps } = props
            
//             /* 取出Context */
//             const { store } = useContext(ReactReduxContext)

//             /* 强化props：合并 store state 和 props  */
//             const trueComponentProps = useMemo(()=>{
//                   /* 只有props或者订阅的state变化，才返回合并后的props */
//                  return selectorFactory(mapStateToProps(store.getState()),wrapperProps) 
//             },[ store , wrapperProps ])

//             /* 只有 trueComponentProps 改变时候,更新组件。  */
//             const renderedWrappedComponent = useMemo(
//               () => (
//                 <WrappedComponent
//                   {...trueComponentProps}
//                   ref={reactReduxForwardedRef}
//                 />
//               ),
//               [reactReduxForwardedRef, WrappedComponent, trueComponentProps]
//             )
//             useEffect(()=>{
//               /* 订阅更新 */
//                const checkUpdate = () => forceUpdate(new Date().getTime())
//                store.subscribe( checkUpdate )
//             },[ store ])
//             return renderedWrappedComponent
//         }
//         /* React.memo 包裹  */
//         const Connect = React.memo(ConnectFunction)

//         /* 处理hoc,获取ref问题 */  
//         if(forwardRef){
//           const forwarded = React.forwardRef(function forwardConnectRef( props,ref) {
//             return <Connect {...props} reactReduxForwardedRef={ref} reactReduxForwardedRef={ref} />
//           })
//           return hoistStatics(forwarded, WrappedComponent)
//         } 
//         /* 继承静态属性 */
//         return hoistStatics(Connect,WrappedComponent)
//     } 
// }
// export default Index

export default 2;