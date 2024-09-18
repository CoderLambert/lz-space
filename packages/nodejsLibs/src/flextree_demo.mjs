
// //  1. 定义数据库
// // import SqliteAdapter from 'flextree-sqlite-adapter';

// // 定义一个异步函数来处理数据库的打开和SQL执行
// // async function initDatabase() {
// //   const sqliteAdapter = new SqliteAdapter("org.db");

// //   // 打开数据库连接
// //   await sqliteAdapter.open();

// //   // 执行SQL语句
// //   try {
// //     await sqliteAdapter.exec(`
// //       CREATE TABLE IF NOT EXISTS org (
// //         id INTEGER PRIMARY KEY AUTOINCREMENT,
// //         name VARCHAR(60),
// //         level INTEGER,
// //         leftValue INTEGER,
// //         rightValue INTEGER
// //       );
// //     `); // 注意：SQL语句末尾加上了分号
// //   } catch (error) {
// //     console.error('Failed to execute SQL:', error);
// //   }
// // }

// // // 调用初始化函数
// // initDatabase().catch(console.error);


// // 第2步：创建树管理器

// import { FlexTreeManager } from 'flextree';
// import SqliteAdapter from 'flextree-sqlite-adapter';



// async function getNodeDetail() {

//     const sqliteAdapter = new SqliteAdapter("org.db")
//     await sqliteAdapter.open()
    
//     const orgManager = await new FlexTreeManager("org",{
//         adapter: sqliteAdapter     
//     })
    
//     // 第3步：添加树节点
    
    
//     // 创建一个根节点
//     await orgManager.createRoot({
//         name: "A公司"
//     })
//     // 添加组织架构的一级部门子节点
//     await orgManager.addNodes([
//         { name: "行政中心" },
//         { name: "市场中心" },
//         { name: "研发中心"} 
//     ])
     
//     // 添加行政中心的部门子节点.
//     const node1 = await orgManager.findNode({name:"行政中心"})
//     await orgManager.addNodes( [
//             { name: "总裁办" },
//             { name: "人力资源部" },
//             { name: "财务部" },
//             { name: "行政部" },
//             { name: "法务部" },
//             { name: "审计部" }
//         ],node1)   // 添加为node的子节点
    
    
    
//         // 获取所有节点
//     await orgManager.getNodes() 
//     // 限定层级获取节点，仅获取第1-3层节点，不包含第4层及以下节点
//     await orgManager.getNodes(3) 
//     // 根据id获取节点
//     await orgManager.getNode(1) 
//     // 获取树根节点
//     await orgManager.getRoot()


//     const node = await orgManager.findNode({name:"行政中心"})
//     // 获取name=行政中心的节点
//     // 获取节点<行政中心>的子节点集
//     await orgManager.getChildren(node)
//     // 获取节点<行政中心>的所有后代节点集
//     await orgManager.getDescendants(node)
//     // 获取节点<行政中心>的所有后代节点集，包括自身
//     await orgManager.getDescendants(node,{includeSelf:true})
//     // 获取节点<行政中心>的所有后代节点集，包括限定层级
//     await orgManager.getDescendants(node,{level:2})
//     // 获取节点<行政中心>的子节点集,level=1相当于只获取直接子节点
//     await orgManager.getDescendants(node,{level:1})

//     // 获取节点<行政中心>的所有祖先节点集
//     await orgManager.getAncestors(node) 
//     // 获取节点<行政中心>的父节点
//     await orgManager.getParent(node) 
//     // 获取节点<行政中心>的所有兄弟节点集
//     await orgManager.getSiblings(node)  
//     // 获取节点<行政中心>的所有兄弟节点集，包括自身
//     await orgManager.getSiblings(node,{includeSelf:true})  
//     // 获取节点<行政中心>的前一个兄弟节点
//     await orgManager.getNextSibling(node)
//     // 获取节点<行政中心>的后一个兄弟节点
//     await orgManager.getPrevSibling(node)
// }

// getNodeDetail().catch(console.error);


import { FlexTreeManager } from 'flextree';
import SqliteAdapter from 'flextree-sqlite-adapter';

async function getNodeDetail() {
    try {
        const sqliteAdapter = new SqliteAdapter("org.db");
        await sqliteAdapter.open();

        // 创建表（如果尚未创建）
        await sqliteAdapter.exec(`
            CREATE TABLE IF NOT EXISTS org (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(60),
                level INTEGER,
                leftValue INTEGER,
                rightValue INTEGER
            );
        `);

        const orgManager = new FlexTreeManager("org", {
            adapter: sqliteAdapter
        });

        // 使用 write 方法包裹所有写操作
        // await orgManager.write(async () => {
        //     // 创建一个根节点
        //     await orgManager.createRoot({
        //         name: "A公司"
        //     });

        //     // 添加组织架构的一级部门子节点
        //     await orgManager.addNodes([
        //         { name: "行政中心" },
        //         { name: "市场中心" },
        //         { name: "研发中心" }
        //     ]);

        //     // 添加行政中心的部门子节点.
        //     const node1 = await orgManager.findNode({ name: "行政中心" });
        //     await orgManager.addNodes([
        //         { name: "总裁办" },
        //         { name: "人力资源部" },
        //         { name: "财务部" },
        //         { name: "行政部" },
        //         { name: "法务部" },
        //         { name: "审计部" }
        //     ], node1); // 添加为node的子节点
        // });

        // 获取所有节点
        console.log(await orgManager.getNodes());
        // 限定层级获取节点，仅获取第1-3层节点，不包含第4层及以下节点
        await orgManager.getNodes(3);
        // 根据id获取节点
        await orgManager.getNode(1);
        // 获取树根节点
        await orgManager.getRoot();

        const node = await orgManager.findNode({ name: "行政中心" });
        // 获取name=行政中心的节点
        // 获取节点<行政中心>的子节点集
        await orgManager.getChildren(node);
        // 获取节点<行政中心>的所有后代节点集
        await orgManager.getDescendants(node);
        // 获取节点<行政中心>的所有后代节点集，包括自身
       console.log(await orgManager.getDescendants(node, { includeSelf: true }));
        // 获取节点<行政中心>的所有后代节点集，包括限定层级
        await orgManager.getDescendants(node, { level: 2 });
        // 获取节点<行政中心>的子节点集, level=1相当于只获取直接子节点
        await orgManager.getDescendants(node, { level: 1 });

        // 获取节点<行政中心>的所有祖先节点集
        console.log(await orgManager.getAncestors(node));
        // 获取节点<行政中心>的父节点
        await orgManager.getParent(node);
        // 获取节点<行政中心>的所有兄弟节点集
        await orgManager.getSiblings(node);
        // 获取节点<行政中心>的所有兄弟节点集，包括自身
        await orgManager.getSiblings(node, { includeSelf: true });
        // 获取节点<行政中心>的前一个兄弟节点
        await orgManager.getNextSibling(node);
        // 获取节点<行政中心>的后一个兄弟节点
        // await orgManager.getPrevSibling(node);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// 异步调用 getNodeDetail 函数
getNodeDetail().catch(console.error);