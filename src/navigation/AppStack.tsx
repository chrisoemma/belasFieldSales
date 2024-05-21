import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";

import MyBusiness from "../features/business/MyBusiness";

import AddBusinessScreen from "../features/business/AddBusiness";
import Settings from "../features/settings/Settings";
import { useTranslation } from "react-i18next";
import CheckInDetails from "../features/business/CheckInDetails";
import Tasks from "../features/tasks/Tasks";
import AddTask from "../features/tasks/AddTask";
import SingleTask from "../features/tasks/SingleTask";
import Clients from "../features/clients/Clients";
import SingleClient from "../features/clients/SingleClient";
import AddClient from "../features/clients/AddClient";
import ContactPeople from "../features/clients/ContactPeople";
import LiveLocation from "../features/location/LiveLocation";
import AddCheckIn from "../features/checkInsOut/AddCheckIn";
import PunchInOut from "../features/punchInOut/PunchInOut";
import PreviousPunchInOut from "../features/punchInOut/PreviousPunchInOut";
import PreviousPunchDetails from "../features/punchInOut/PreviousPunchDetails";

  
  const AppStack = () => {

    const { t } = useTranslation();
    
    const Stack = createNativeStackNavigator();
    const screenOptions = {
        headerShown: false,
      };

    return (
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen name="Home" component={DrawerNavigator} 
         options={{ headerShown: false }}
        />
      <Stack.Screen name="Tasks" component={Tasks}
        options={{ title: t('navigate:tasks') }}
        />

      <Stack.Screen name="Add Task" component={AddTask}
        options={{ title: t('screens:addTask') }}
        />
      
      <Stack.Screen name="Add CheckIn" component={AddCheckIn}
        options={{ title: t('screens:addCheckIn') }}
        />

        <Stack.Screen name="Single Task" component={SingleTask}
        options={{ title: t('screens:singleTask') }}
        />

        <Stack.Screen name="punchInOut" component={PunchInOut}
        options={{ title: t('screens:punchInOut') }}
        />

      <Stack.Screen name="previousPunchInOut" component={PreviousPunchInOut}
        options={{ title: t('screens:previousRecords') }}
        />

       <Stack.Screen name="previousPunchDetails" component={PreviousPunchDetails}
        options={{ title: t('screens:previousPunchDetails') }}
        />


       <Stack.Screen name="Clients" component={Clients}
        options={{ title: t('screens:clients') }}
        />
         <Stack.Screen name="Single Client" component={SingleClient}
        options={{ title: t('screens:singleClient') }}
        />

       <Stack.Screen name="Add Client" component={AddClient}
        options={{ title: t('screens:addClient') }}
        />

         <Stack.Screen name="Contact People" component={ContactPeople}
        options={{ title: t('screens:contactPeople') }}
        />

        <Stack.Screen name="My Businesses" component={MyBusiness}
        options={{ title: t('navigate:business') }}
        />

        <Stack.Screen name="Details" 
        component={CheckInDetails} 
        options={{ title: t('screens:details') }}
        />
        <Stack.Screen name="Add Business" 
        component={AddBusinessScreen}
        options={{ title: t('navigate:addBusiness') }}
        />
     
        <Stack.Screen
         name="Settings" 
        component={Settings} 
        options={{ title: t('navigate:settings') }}
        />

        <Stack.Screen
         name="Live Location" 
        component={LiveLocation} 
        options={{ title: t('navigate:liveLocation') }}
        /> 

        
        
      </Stack.Navigator>
    );
  };

  export default AppStack