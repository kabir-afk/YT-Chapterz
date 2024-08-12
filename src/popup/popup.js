import React from "react";
import ReactDOM from "react-dom/client";
// import { HashRouter, Routes, Route } from "react-router-dom";
import Transcript from "../pages/Transcript";
import Summary from "../pages/Summary";
import reportWebVitals from "../reportWebVitals";
import {  Tabs, TabList, TabPanels, Tab, TabPanel,ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      {/* <HashRouter>
        <Flex bgColor={'tomato'} color={'blanchedalmond'} w={'300px'}>
            <nav>
                <ul>
                  <li>
                    <a href="#/">Transcript</a>
                  </li>
                  <li>
                    <a href="#/summary">Summary</a>
                  </li>
                </ul>
            </nav>
        </Flex>
        <Routes>
          <Route index element={<Transcript />} />
          <Route path="summary" element={<Summary />} />
        </Routes>
      </HashRouter> */}
      <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList>
    <Tab>Transcript</Tab>
    <Tab>Summary</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
        <Transcript/>
    </TabPanel>
    <TabPanel>
      <Summary/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </ChakraProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
