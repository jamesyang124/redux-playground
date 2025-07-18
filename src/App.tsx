import { Routes, Route } from 'react-router-dom'
import { 
  AppContainer, 
  Header, 
  AppTitle, 
  Subtitle, 
  Nav, 
  NavLink,
  DemoGrid,
  DemoCard,
  DemoTitle,
  DemoDescription,
  DemoFeatures,
  DemoFeature,
  DemoStatus,
  GlobalFonts
} from './components/ui'
import MutationDemo from './demos/rtk-mutation/MutationDemo'
import QueryDemo from './demos/rtk-query/QueryDemo'  
import ThunkDemo from './demos/async-thunks/ThunkDemo'

interface Demo {
  path: string
  title: string
  description: string
  features: string[]
  status: 'ready' | 'beta' | 'coming-soon'
}

const demos: Demo[] = [
  {
    path: '/rtk-mutation',
    title: 'RTK Mutation',
    description: 'Learn how to handle data mutations with RTK Query. Create, update, and delete data with optimistic updates and cache management.',
    features: [
      'Mutation endpoints',
      'Optimistic updates', 
      'Cache invalidation',
      'Error handling',
      'Loading states'
    ],
    status: 'ready'
  },
  {
    path: '/rtk-query',
    title: 'RTK Query',
    description: 'Explore data fetching and caching with RTK Query. Automatic background updates, intelligent caching, and seamless data synchronization.',
    features: [
      'Query endpoints',
      'Automatic caching',
      'Background refetching',
      'Conditional queries',
      'Polling support'
    ],
    status: 'ready'
  },
  {
    path: '/async-thunks',
    title: 'Async Thunks',
    description: 'Understand asynchronous actions with createAsyncThunk. Handle complex async logic with proper loading states and error management.',
    features: [
      'createAsyncThunk',
      'Pending/fulfilled/rejected states',
      'Error handling',
      'Thunk chaining',
      'Custom payloads'
    ],
    status: 'ready'
  }
]

const Home = () => (
  <div>
    <h2>Redux & RTK Interactive Demos</h2>
    <p>Explore Redux Toolkit concepts through hands-on, interactive examples. Each demo is self-contained and focuses on specific Redux patterns.</p>
    
    <DemoGrid>
      {demos.map((demo) => (
        <DemoCard key={demo.path} to={demo.path}>
          <DemoTitle>{demo.title}</DemoTitle>
          <DemoDescription>{demo.description}</DemoDescription>
          <DemoFeatures>
            {demo.features.map((feature, index) => (
              <DemoFeature key={index}>{feature}</DemoFeature>
            ))}
          </DemoFeatures>
          <DemoStatus status={demo.status}>
            {demo.status === 'ready' ? '✓ Ready' : demo.status}
          </DemoStatus>
        </DemoCard>
      ))}
    </DemoGrid>
  </div>
)

function App() {
  return (
    <>
      <GlobalFonts />
      <AppContainer>
      <Header>
        <AppTitle>Redux Playground</AppTitle>
        <Subtitle>Learn Redux & RTK by building</Subtitle>
      </Header>

      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/rtk-mutation">RTK Mutation</NavLink>
        <NavLink to="/rtk-query">RTK Query</NavLink>
        <NavLink to="/async-thunks">Async Thunks</NavLink>
      </Nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rtk-mutation" element={<MutationDemo />} />
        <Route path="/rtk-query" element={<QueryDemo />} />
        <Route path="/async-thunks" element={<ThunkDemo />} />
      </Routes>
    </AppContainer>
    </>
  )
}

export default App