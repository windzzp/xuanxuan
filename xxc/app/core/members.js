import Member from './models/member';
import {getCurrentUser, onSwapUser, getCurrentUserAccount} from './profile';
import events from './events';
import Lang from './lang';
import {formatString} from '../utils/string-helper';

/**
 * 缓存当前用户所有用户信息
 * @type {Object<string, Member>}
 * @private
 */
let members = null;

/**
 * 用户搜索用户的表
 * @private
 * @type {Object<string, Member>}
 */
let membersMapForSearch = {};

/**
 * 用户匹配正则表达式
 */
let membersMatchRegex = null;

/**
 * 缓存当前用户角色表
 * @type {Object<string, Object>}
 * @private
 */
let roles = null;

/**
 * 缓存当前用户部门表
 * @type {Object<string, Object>}
 * @private
 */
let depts = null;

/**
 * 事件名称表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    change: 'members.change',
};

/**
 * 更新缓存的用户数据
 * @param {Object[]} memberArr 要更新的用户
 * @@return {void}
 */
export const updateMembers = memberArr => {
    if (!Array.isArray(memberArr)) {
        memberArr = [memberArr];
    }

    const newMembers = {};

    memberArr.forEach(member => {
        member = Member.create(member);
        const user = getCurrentUser();
        const {id, realname} = member;
        const isMe = user && id === user.id;
        member.isMe = isMe;
        newMembers[id] = member;
        if (isMe) {
            user.assign({realname, avatar: member.avatar});
        }
        if (realname) {
            membersMapForSearch[member.realname] = member;
        }
        membersMapForSearch[`@${member.account}`] = member;
    });

    Object.assign(members, newMembers);
    events.emit(EVENT.change, newMembers, members);
    events.emitDataChange({members: newMembers});
};

/**
 * 绑定成员变更事件
 * @param {Funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onMembersChange = listener => events.on(EVENT.change, listener);

/**
 * 部门排序比较函数
 * @param {Object} d1 部门1
 * @param {Object} d2 部门2
 * @return {number}
 */
export const deptsSorter = (d1, d2) => {
    let result = (d1.order || 0) - (d2.order || 0);
    if (result === 0 || Number.isNaN(result)) {
        result = d1.id - d2.id;
    }
    return result;
};

/**
 * 初始化缓存的部门表
 * @param {Object} deptsMap 部门表
 * @return {void}
 */
export const initDepts = (deptsMap) => {
    depts = {};
    if (deptsMap) {
        const deptsArr = Object.keys(deptsMap).map(deptId => {
            const dept = deptsMap[deptId];
            dept.id = deptId;
            return deptId;
        }).sort(deptsSorter);
        deptsArr.forEach(deptId => {
            const dept = deptsMap[deptId];
            let parentDept = dept.parent && deptsMap[dept.parent];
            if (parentDept) {
                const parents = [];
                if (!parentDept.children) {
                    parentDept.children = [];
                }
                parentDept.children.push(dept);
                while (parentDept) {
                    parents.push(parentDept);
                    parentDept = parentDept.parent && deptsMap[parentDept.parent];
                }
                dept.parents = parents;
            }
            depts[deptId] = dept;
        });
    }
};

/**
 * 获取部门树结构对象
 * @return {Object[]}
 */
export const getDeptsTree = () => {
    return Object.keys(depts).map(x => depts[x]).filter(x => !x.parents).sort(deptsSorter);
};

/**
 * 初始化缓存的用户数据
 * @param {Object[]} memberArr 要更新的用户
 * @param {Object} rolesMap 角色表
 * @param {Object} deptsMap 部门表
 * @@return {void}
 */
export const initMembers = (memberArr, rolesMap, deptsMap) => {
    membersMatchRegex = null;

    roles = rolesMap || {};

    Object.keys(members).forEach(membersId => {
        const member = members[membersId];
        if (!member.temp && !member.isDeleted) {
            member.$set('deleted', true);
        }
    });
    if (memberArr && memberArr.length) {
        updateMembers(memberArr);
    }

    initDepts(deptsMap);
};

/**
 * 获取缓存中的所有用户数据
 * @return {Member[]}
 */
export const getAllMembers = () => (members ? Object.keys(members).map(x => members[x]) : []);

/**
 * 遍历缓存中的用户数据
 * @param {Function(member: Member)} callback 遍历回调函数
 * @param {boolean} [ignoreDeleteUser=false] 是否忽略已删除的用户
 * @return {void}
 */
export const forEachMember = (callback, ignoreDeleteUser = false) => {
    if (members) {
        Object.keys(members).forEach(memberId => {
            if (!ignoreDeleteUser || !members[memberId].isDeleted) {
                callback(members[memberId]);
            }
        });
    }
};

/**
 * 获取用户引用匹配正则表达式
 * @private
 * @return {RegExp} 用户引用匹配正则表达式
 */
export const getMentionsMatchRegex = () => {
    if (!membersMatchRegex && members && (Object.keys(members).length < 500)) {
        const matchList = ['@#\\d+'];
        forEachMember(member => {
            matchList.push(`@${member.account}`);
            if (member.realname) {
                matchList.push(`@${member.realname}`);
            }
        });
        matchList.sort((x, y) => (y.length - x.length));
        membersMatchRegex = new RegExp(matchList.join('|'), 'gi');
    }
    return membersMatchRegex;
};

/**
 * 根据用户账号或 ID 获取缓存中的用户对象
 *
 * @param {!string} idOrAccount 账号或 ID
 * @return {Member}
 */
export const getMember = (idOrAccount) => {
    let member = members[idOrAccount];
    if (!member) {
        member = membersMapForSearch[`@${idOrAccount}`];
        if (!member) {
            member = new Member({
                id: idOrAccount,
                account: idOrAccount,
                realname: `User-${idOrAccount}`
            });
            member.temp = true;
        }
    }
    return member;
};

/**
 * 根据用户的账号、ID 或真实姓名获取用户对象
 * @param {!string} search 用于辨识用户的字符串，可以为用户的账号、ID 或真实姓名
 * @return {Member} 成员实例
 */
export const guessMember = (search) => {
    let member = members[search];
    if (!member) {
        const searchType = search[0];
        if (searchType === '#') {
            member = members[search.substr(1)];
        } else if (searchType === '@') {
            member = membersMapForSearch[search];
        } else {
            member = membersMapForSearch[search] || membersMapForSearch[`@${search}`];
        }
    }
    return member;
};

/**
 * 查询缓存中的用户数据，查询条件可以为：
 * - `Object`，包含属性值的对象；
 * - `Function`，使用函数判断是否符合要求；
 * - `string[]`，用户用户名或 ID 组成的字符串数组
 * @param {Object|Function|string[]} condition 查询条件
 * @param {string|boolean} sortList 排序依据，如果为 `true` 则使用默认排序依据
 * @return {Member[]} 查询结果
 */
export const queryMembers = (condition, sortList) => {
    let result = null;
    if (typeof condition === 'object' && condition !== null) {
        const conditionObj = condition;
        const conditionKeys = Object.keys(conditionObj);
        condition = member => {
            for (const key of conditionKeys) {
                if (conditionObj[key] !== member[key]) {
                    return false;
                }
            }
            return true;
        };
    }
    if (typeof condition === 'function') {
        result = [];
        forEachMember(member => {
            if (condition(member)) {
                result.push(member);
            }
        });
    } else if (Array.isArray(condition)) {
        result = [];
        condition.forEach(x => {
            const member = getMember(x);
            if (member) {
                result.push(member);
            }
        });
    } else {
        result = getAllMembers();
    }
    if (sortList && result && result.length) {
        const user = getCurrentUser();
        Member.sort(result, sortList, user && user.id);
    }
    return result || [];
};

/**
 * 从缓存数据中移除指定的用户
 * @param {Member|string} member 用户对象实例或用户用户名或 ID
 * @return {boolean} 如果为 `true` 移除成功，如果为 `false` 移除失败，通常是找不到对应的用户
 */
export const removeMember = member => {
    const memberId = (typeof member === 'object') ? member.id : member;
    if (members[memberId]) {
        delete members[memberId];
        delete membersMapForSearch[`@${member.account}`];
        delete membersMapForSearch[member.realname];
        return true;
    }
    return false;
};

/**
 * 获取角色显示名称
 * @param {string} role 角色代号
 * @return {string}
 */
export const getRoleName = role => ((role && roles) ? (roles[role] || Lang.string(`member.role.${role}`, role)) : '');

/**
 * 获取部门数据对象
 * @param {string} deptId 部门 ID
 * @return {Object<string, any>} 部门数据对象
 */
export const getDept = deptId => depts[deptId];

// 当当前登录的用户用户名变更时清空缓存中的用户数据
onSwapUser(() => {
    members = {};
    roles = null;
    depts = null;
    membersMapForSearch = {};
    membersMatchRegex = null;
});

/**
 * 将文本中的 `@user` 转换为 HTML 链接
 * @param {string} text 文本内容
 * @param {{format: string}} param1 格式化选项
 * @return {string} 转换后的文本
 */
export const linkMentionsInText = (text, {format = '<a class="app-link {className}" data-url="@Member/{id}">@{displayName}</a>'}) => {
    if (text && text.length && text.includes('@')) {
        const langAtAll = Lang.string('chat.message.atAll');
        const userAccount = getCurrentUserAccount();
        const mentionsRegex = getMentionsMatchRegex() || /@(?:#?\d+|[_\w\u4e00-\u9fa5]+)/gi;
        text = text.replace(mentionsRegex, (mention) => {
            mention = mention.substring(1);
            const m = guessMember(mention);
            if (m) {
                return formatString(format, {
                    displayName: m.displayName,
                    id: m.id,
                    account: m.account,
                    className: m.account === userAccount ? 'at-me' : '',
                });
            }
            if (mention === 'all' || mention === langAtAll) {
                return `<span class="at-all">@${langAtAll}</span>`;
            }
            return mention;
        });
    }
    return text;
};

export default {
    update: updateMembers,
    init: initMembers,
    get: getMember,
    getAll: getAllMembers,
    forEach: forEachMember,
    guess: guessMember,
    query: queryMembers,
    remove: removeMember,
    getRoleName,
    getDept,
    getDeptsTree,
    deptsSorter,
    onMembersChange,
    linkMentionsInText,
    get map() {
        return members;
    },
    get all() {
        return getAllMembers();
    },
    get depts() {
        return depts;
    },
    get hasDepts() {
        return depts && Object.keys(depts).length;
    }
};
