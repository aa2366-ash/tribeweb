import React, { useEffect } from "react";
import { Box, ChakraProvider, Spinner } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import RegisterComp from "./Screens/Register/Register";
import HomeComp from "./Screens/Home/Home";
import Logincomp from "./Screens/Login/Login";
import Invitecomp from "./Screens/Invite/Invite";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "./Redux/rootReducer";
import TopNavBar from "./components/Navbar";
import IUser from "./Types/user";
import post from "./utils/post";
import get from "./utils/get";
import { setCurrentUser } from "./Redux/User/userAction";
import Tribe from "./Screens/Tribe/Tribe";

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const refreshtoken = useSelector<IStore>((store) => store.user.refreshtoken);
  if (refreshtoken) return <Route {...rest}> {children}</Route>;
  else return <Redirect to="/login" />;
};

const PublicRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const refreshtoken = useSelector<IStore>((store) => store.user.refreshtoken);
  if (!refreshtoken) return <Route {...rest}> {children} </Route>;
  else return <Redirect to="/home" />;
};

const App = () => {
  const refreshtoken = localStorage.getItem("refreshtoken");
  const userId = useSelector<IStore>((store) => store.user.currentUser?.id);
  const dispatch = useDispatch();
  useEffect(() => {
    if (refreshtoken && !userId) {
      get("api/user/me").then((result) =>
        dispatch(setCurrentUser({ currentUser: result.user }))
      );
    }
  }, []);
  if (refreshtoken && !userId) return <Spinner />;
  return <AppRoutes />;
};
function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/register">
          <RegisterComp />
        </Route>
        <Route exact path="/invite">
          <Invitecomp />
        </Route>
        <PublicRoute exact path="/login">
          <Logincomp />
        </PublicRoute>
        <Route exact path="/forgotpwd"></Route>
        <PrivateRoute exact path="/home">
          <TopNavBar>
            <HomeComp />
          </TopNavBar>
        </PrivateRoute>
        <Route exact path="/tribe/:tribeId">
          <TopNavBar>
            <Tribe />
          </TopNavBar>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
