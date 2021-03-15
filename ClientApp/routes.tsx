import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Users } from './components/MainPages/Users/Users';
import { Records } from './components/MainPages/Records/Records'
import { Elections } from './components/MainPages/Elections/Elections'
import { Assets } from './components/MainPages/NFT/NFTs'
import { AssetClasses } from './components/MainPages/NFTClasses/NFTClasses'
import { Network } from './components/MainPages/NetworkStats/NetworkStats';
import { Login } from './components/MainPages/Login/Login'
import { MyProfile } from './components/MainPages/MyProfile/MyProfile'
import { Messages } from './components/MainPages/SignedMessages/SignedMesages'
import { Tools } from './components/MainPages/Tools/Tools'

export const routes = <Layout>
    <Route exact path='/' component={Users} />
    <Route path='/users' component={Users} />
    <Route path='/records' component={Records} />    
    <Route path='/elections' component={Elections} />
    <Route path='/NFTs' component={Assets} />
    <Route path='/NFTgroups' component={AssetClasses} />
    <Route path='/stats' component={Network} />
    <Route path='/login' component={Login} />
    <Route path='/myprofile' component={MyProfile} />
    <Route path='/logout' component={Users} />
    <Route path='/messages' component={Messages} />
    <Route path='/tools' component={Tools} />

</Layout>;