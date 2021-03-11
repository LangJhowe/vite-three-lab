import PlaneText from '../model/PlaneText.class'

export default (engine:any) => {
  const planText1 = new PlaneText('cyberpunk', { color: '#EEE600' })
  planText1.position.y = 3
  console.log(planText1.position)

  engine.add(planText1)
}
