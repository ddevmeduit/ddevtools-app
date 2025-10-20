import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import DFPSConfig from './pages/dfps/config'
import FileCheckerHome from './pages/file-checker'
import DBPSConfig from './pages/dbps/config'

import './App.css'
import {
  DBPS_ROUTE,
  DFPS_ROUTE,
  DMRS_ROUTE,
  FILE_CHECKER_ROUTE,
  STATEMENT_BUILDER_ROUTE
} from './components/Nav'
import StatementBuilder from './pages/statement_builder'
import DMRSConfig from './pages/dmrs'
import DMRSProvider from './context/dmrs-context'

function App() {
  return (
    <DMRSProvider>
      <div className='container mx-auto overflow'>
        <Router>
          <Routes>
            <Route path={DFPS_ROUTE} element={<Layout />}>
              <Route index element={<DFPSConfig />} />
              <Route path={DBPS_ROUTE} element={<DBPSConfig />} />
              <Route path={DMRS_ROUTE} element={<DMRSConfig />} />
              <Route path={FILE_CHECKER_ROUTE} element={<FileCheckerHome />} />
              <Route path={STATEMENT_BUILDER_ROUTE} element={<StatementBuilder />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </DMRSProvider>
  )
}

export default App
