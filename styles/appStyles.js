import styled from "styled-components/native";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  TextInput,
} from "react-native";
import Constants from "expo-constants";

// Colors
export const colors = {
  primary: "#F2F7FF",
  secondary: "#93D8F8",
  tertiary: "#2F2D51",
  alternative: "white",
};

const statusBarHeight = Constants.statusBarHeight;

export const Container = styled.View`
  background-color: '${colors.primary}';
  padding: 20px;
  padding-bottom: 0px;
  flex: 1;
  padding-top: ${statusBarHeight}px;
`;

export const Container1 = styled.View`
  background-color: ${colors.primary};
  padding-bottom: 0px;
  flex: 1;
  padding-top: ${statusBarHeight}px;
`;

// Header
export const HeaderView = styled.View`
position:relative;
  margin-top:10px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 20px;
  color: ${colors.tertiary};
`;
export const HeaderButton = styled.TouchableOpacity`
/* display: flex;
flex-direction: row; */
align-items:center;
  font-weight: bold;
  color: ${colors.tertiary};
  z-index:999;
`;

// List
export const ListContainer = styled.View`
  flex: 1;
`;

export const ListView = styled.TouchableHighlight`
  background-color: ${colors.secondary};
  min-height: 85px;
  width: 100%;
  padding: 15px;
  justify-content: space-around;
  margin-bottom: 20px;
  border-radius: 10px;
`;

export const ListViewHidden = styled.View`
  min-height: 89.5px;
  width: 100%;
  padding: 15px;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;
  border-radius: 10px;
`;

export const HiddenButton = styled.TouchableOpacity`
  width: 55px;
  align-items: center;
`;

export const TodoText = styled.Text`
  width: 95%;
  font-size: 16px;
  letter-spacing: 1px;
  color: ${colors.tertiary};
`;

export const TodoDate = styled.Text`
  font-size: 10px;
  letter-spacing: 1px;
  color: ${colors.alternative};
  text-align: right;
  text-transform: uppercase;
  padding-top: 8px;
`;

export const TodoCategory = styled.View`
  background-color:#121212;
  margin-top:5px;
  border-radius:20px;
  padding:5px;
  font-size: 9px;
  letter-spacing: 1px;
  color: ${colors.alternative};
  text-align: left;
`;

// Text for swiped todo row
export const SwipedTodoText = styled(TodoText)`
  color: ${colors.tertiary};
  font-style: italic;
  text-decoration: line-through;
`;

// Modal
export const ModalButton = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  background-color: ${colors.tertiary};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  align-self: center;  
    position: absolute;
  bottom: 13px;
`;

export const ModalButton2 = styled.TouchableOpacity`
  width: 65px;
  height: 65px;
  background-color: ${colors.tertiary};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  align-self: flex-end; 
  position: absolute;
  bottom: 13px;
  right:5%;
`;

export const ModalButton4 = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  background-color: ${colors.tertiary};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  align-self: flex-end; 
  position: absolute;
  bottom: 10px;
  right:5%;
`;


export const ModalButton3 = styled.TouchableOpacity`
 width: 70px;
  height: 70px;
  background-color: ${colors.tertiary};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  align-self: flex-end; 
  position: absolute;
  bottom: 13px;
  left:5%;
`;

export const ModalContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${colors.primary};
`;

export const ModalView = styled.View`
  background-color: ${colors.secondary};
  border-radius: 20px;
  padding: 25px;

`;

export const StyledInput = styled.TextInput`
  width: 300px;
  height: 70px;
  background-color: ${colors.tertiary};
  padding: 10px;
  font-size: 14px;
  border-radius: 10px;
  color: ${colors.alternative};
  letter-spacing: 1px;
`;

export const StyledInput2 = styled.TextInput`
  width: 150px;
  height: 50px;
  background-color: ${colors.tertiary};
  padding: 10px;
  font-size: 14px;
  border-radius: 10px;
  color: ${colors.alternative};
  letter-spacing: 1px;
`;

export const ModalAction = styled.TouchableOpacity`
  width: 65px;
  height: 65px;
  background-color: ${(props) => props.color};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

export const ModalAction2 = styled.TouchableOpacity`
  padding:20px;
  background-color: ${(props) => props.color};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

export const ModalActionGroup = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
`;

export const ModalActionGroup2 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;

export const ModalIcon = styled.View`
  align-items: center;
  margin-bottom: 30px;
`;
