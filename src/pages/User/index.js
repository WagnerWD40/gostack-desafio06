import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { ActivityIndicator, TouchableNativeFeedback } from 'react-native';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    LoadingContainer,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: false,
        page: 1,
        userLogin: '',
        refreshing: false,
    };

    async componentDidMount() {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        this.setState({
            loading: true,
            userLogin: user.login,
        });

        const res = await api.get(`users/${user.login}/starred`);

        this.setState({
            stars: res.data,
            loading: false,
        });
    };

    loadStars = async (page = 1) => {
        const { userLogin, stars } = this.state;

        const res = await api.get(`users/${userLogin}/starred?page=${page}`);

        if (!res.data) {
            return
        };
        
        console.log(page, 'pagina carregada')
        console.log(stars)
        console.log(res.data)

        this.setState({
            stars: [...stars, ...res.data],
            refreshing: false,
        });
    };

    loadMore = () => {
        const { page } = this.state;
    
        const nextPage = page + 1;

        console.log(nextPage, 'inside loadMore()')

        this.setState({
            page: nextPage,
        });

        this.loadStars(nextPage);
    };

    refreshList = () => {
        this.setState({ refreshing: true, stars: [] }, this.loadStars);
    };

    handleNavigate = async (repository) => {
        //alert('inside handleNavigate');

        const { navigation } = this.props;

        navigation.navigate('Repository', { repository });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading, refreshing } = this.state;

        const user = navigation.getParam('user');

        return(
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>

                {loading ? (
                    <LoadingContainer>
                        <ActivityIndicator color='#7159c1' size='large'/>
                    </LoadingContainer>            
                ) : (
                    <Stars
                        onRefresh={this.refreshList}
                        refreshing={refreshing}
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        renderItem={({ item }) => (
                            <TouchableNativeFeedback onPress={() => this.handleNavigate(item)} >
                                <Starred>
                                    <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                                    <Info>
                                        <Title>{item.name}</Title>
                                        <Author>{item.owner.login}</Author>
                                    </Info>
                                </Starred>
                            </TouchableNativeFeedback>
                    )}
                />
                )}
            </Container>
        );
    };
};