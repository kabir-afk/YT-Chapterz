import React from "react";
import ReactDOM from "react-dom/client";
import Transcript from "../pages/Transcript";
import Summary from "../pages/Summary";
import CustomTab from "../pages/CustomTab";
import reportWebVitals from "../reportWebVitals";
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  ChakraProvider,
} from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Tabs isFitted>
        <TabList>
          <CustomTab tabName = {'Transcript'}/>
          <CustomTab tabName = {'Summary'}/>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Transcript />
          </TabPanel>
          <TabPanel>
            <Summary />
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
