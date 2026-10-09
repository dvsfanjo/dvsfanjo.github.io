这是一个线段树优化建图板子题。



## 思路



下文中的边，没有特殊说明，都指的是权值为 $0$ 的单向边。



线段树优化建图核心在于优化连边数，把区间分为 $\log n$ 个小区间处理。



首先，我们先搞出两棵线段树，一棵是儿子指向父亲，叫出树；一棵是父亲指向孩子，叫做入树。



我们把出树看作一个发射器，入树看作一个接收器，从某个节点出发，进入出树，发射出去，被入树接受，到达其他节点。



（左边是入树，右边是出树）



![](https://cdn.luogu.com.cn/upload/image_hosting/uzn5runt.png)



如果我们要连一条从区间 $[1,2]$ 到区间 $[3,5]$ 的单向边，只要将结点 $17$ 连向结点 $11$ 和结点 $12$。



这样我们要连接 $\log^2n$ 条边，只需要建一个中转点，从出树连到中转点，再从中转点连到入树，只用连接 $2\log n$ 条边。



![](https://cdn.luogu.com.cn/upload/image_hosting/oxws2kni.png)



题目要求连双向边，那么我们从出树的 $[3,3]$ 和 $[4,5]$ 做之前的连边操作到入树的 $[1,2]$ 即可。



建树 $O(n\log n)$，连边一次 $O(\log n)$，建图总时间复杂度为 $O((n+m)\log n)$。



最短路直接跑 01BFS 即可，因为共有 $(n+m)\log n$ 条边，所以 01BFS 复杂度为 $O((n+m)\log n)$。



故总时间复杂度 $O((n+m)\log n)$。



## code



```cpp

#include <bits/stdc++.h>

using namespace std;

using ll = long long;

const int maxn = 5e5 + 5;

int n, m, P, a, b, c, d, p, inrt, ourt;

int ls[maxn << 3], rs[maxn << 3], tot;

vector<pair<int, int>> G[maxn << 3];

int dis[maxn << 3], vis[maxn << 3];

#define mid (l + r >> 1)

int build_in(int l, int r) {

	int u = ++tot; 

	if (l == r) {

        G[u].push_back({l, 0});

    } else {

        G[u].push_back({ls[u] = build_in(l, mid), 0});

        G[u].push_back({rs[u] = build_in(mid + 1, r), 0});

    } return u;

}

int build_out(int l, int r) {

    ll u = ++tot;

	if (l == r) {

        G[l].push_back({u, 0});

    } else {

        G[ls[u] = build_out(l, mid)].push_back({u, 0});

        G[rs[u] = build_out(mid + 1, r)].push_back({u, 0});

    } return u;

}

void update(int l, int r, int u, int L, int R, int to, int w) {

    if (L <= l && r <= R) {

        if (w) G[u].push_back({to, w});

        else G[to].push_back({u, w});

    } else {

        if (L <= mid) update(l, mid, ls[u], L, R, to, w);

        if (mid < R) update(mid + 1, r, rs[u], L, R, to, w);

    } return;

}

void Bfs01() {

    memset(dis, 0x3f, sizeof dis); dis[P] = 0;

    list<pair<int, int>> que; que.push_front({P, 0});

    while (!que.empty()) {

        int u = que.front().first, v = que.front().second;

        que.pop_front(); if (vis[u]) continue; vis[u] = true;

        for (auto g : G[u]) {

            dis[g.first] = min(dis[g.first], v + g.second);

            if (!g.second) que.push_front({g.first, dis[g.first]});

            else que.push_back({g.first, dis[g.first]});

        }

    } return;

}

int main() {

    ios::sync_with_stdio(0);

    cin.tie(0); cout.tie(0);

    cin >> n >> m >> P; tot = n;

    inrt = build_in(1, n);

    ourt = build_out(1, n);

    for (int i = 1; i <= m; i++) {

        cin >> a >> b >> c >> d;

        ll p = ++tot, q = ++tot;

        update(1, n, ourt, a, b, p, 1);

        update(1, n, inrt, c, d, p, 0);

        update(1, n, ourt, c, d, q, 1);

        update(1, n, inrt, a, b, q, 0);

    } Bfs01();

    for (int i = 1; i <= n; i++) {

        cout << dis[i] << '\n';

    }

    return 0;

}

```

