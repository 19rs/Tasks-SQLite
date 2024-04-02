import styled from "styled-components/native";

export const CalendarView = styled.View`
    background-color: #292d3e;
    border-radius: 10px;
    border: 1px solid #fafafa;
    margin-bottom: 30px;
    margin-top: 15px;
    padding: 15px;
    height: 130px;
`;

export const TopDateInfo = styled.View`
    flex-direction: row;
    margin-bottom: 15px;
`;

export const DatePrevArea = styled.TouchableOpacity`
    flex: 1;
    justify-content: flex-end;
    align-items: flex-end;
`;

export const DateNextArea = styled.TouchableOpacity`
    flex: 1;
    align-items: flex-start;
`;

export const DateTitleArea = styled.View`
    width: 140px;
    justify-content: center;
    align-items: center;
`;

export const DateTitle = styled.Text`
    font-size: 17px;
    font-weight: bold;
    color: #ceff27;
`;

export const DateList = styled.ScrollView``;

export const DateItem = styled.TouchableOpacity`
    width: 45px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 5px 0;
`;

export const DateItemWeekDay = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #fafafa;
`;

export const DateItemNumber = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #fafafa;
`;

