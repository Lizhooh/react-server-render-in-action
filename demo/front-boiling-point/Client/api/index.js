import axios from 'axios';
import { WSAEHOSTUNREACH } from 'constants';

const APIS = {
    login: 'http://127.0.0.1:3000/api/login',
    sign: 'http://127.0.0.1:3000/api/sign',
    auth: 'http://127.0.0.1:3000/api/auth',
    logout: 'http://127.0.0.1:3000/api/logout',
};

export const login = async (email, password) => {
    const res = await axios.post(APIS.login, {
        email, password,
    });
    return res.data;
}

export const sign = async (email, password, name) => {
    const res = await axios.post(APIS.sign, {
        email, password, name,
    });
    return res.data;
}

export const logout = async () => {
    const res = await axios.post(APIS.logout)
    return res.data;
}

export const boils = async () => {
    const { data } = await axios.post('http://127.0.0.1:3000/gql-api', {
        query: `query {
            boils(limit: 20, offset: 0) {
                id, content, image, createdAt, likes, user {
                    name, summary, id
                }
            }
        }`,
    });
    return data;
}

export const addLike = async (bid, uid) => {
    const { data } = await axios.post('http://127.0.0.1:3000/gql-api', {
        query: `mutation {
            addLike(bid: "${bid}", uid: "${uid}")
        }`,
    });
    return data;
}

export const cancelLike = async (bid, uid) => {
    const { data } = await axios.post('http://127.0.0.1:3000/gql-api', {
        query: `mutation {
            cancelLike(bid: "${bid}", uid: "${uid}")
        }`,
    });
    return data;
}

export const addBoil = async (boil) => {
    const { data } = await axios.post('http://127.0.0.1:3000/gql-api', {
        query: `mutation {
            createBoil(
              content: "${boil.content.replace(/\n/g, '<br />')}",
              userId: "${boil.userid}",
              userName: "${boil.username}",
              image: "${boil.image}"
            )
        }`,
    });
    return data;
}

export const removeBoil = async (id) => {
    const { data } = await axios.post('http://127.0.0.1:3000/gql-api', {
        query: `mutation {
            removeBoil(
              id: "${id}"
            )
        }`,
    });
    return data;
}

export const updateBoil = async (id, content, image) => {
    const { data } = await axios.post('http://127.0.0.1:3000/gql-api', {
        query: `mutation {
            updateBoil(
              id: "${id}", image: "${image}", content: "${content}"
            )
        }`,
    });
    return data;
}
