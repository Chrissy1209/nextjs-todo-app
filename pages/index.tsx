import type { NextPage } from 'next'

import Edit from './todo/edit'
import List from './todo/list'

const Home: NextPage = () => {

  return (
    <div>
      <h1>備忘錄</h1>
      <Edit />
      <List />
      {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
    </div>
  )
}

export default Home
