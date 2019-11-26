import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native';

export default class Repository extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('repository').name,
    });

    render() {
        const { navigation } = this.props;
        const repository = navigation.getParam('repository');
        console.log(repository)

        return (
            <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
        );
    };
};