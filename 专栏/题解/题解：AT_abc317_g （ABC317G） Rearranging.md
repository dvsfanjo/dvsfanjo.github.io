## 思路



很容易想到贪心地填颜色，建一个二分图，将行作为一半，颜色作为另一半，由 $i$ 到 $a_{i,j}$ 连边，随后先跑一次二分图匹配，将每一行都匹配到一种颜色，随后将这些元素从二分图中删去，随后下一列继续这样做，做 $m$ 次，若其中有一列匹配的边数小于 $n$ 则不合法，退出。



## 证明



这个贪心是对的，一开始二分图中每一个点的度数都是 $m$，删除一次边会让所有点度数减一，即二分图任意时刻左侧度数等于右侧度数，此时是一个左右节点度数相等的正则二分图，此时任意一个点集 $S$ 的邻域 $N(S)$ 的大小都是一致的。



根据 Hall 定理在 $|N(S)|\le|S|$ 时存在完美匹配，而这个二分图显然符合。



## 实现



这里使用了网络流跑二分图匹配，每次删边要把正反边的流量清零，否则下次统计答案时不要因为正边流量为 $0$ 就当作答案，因为这会统计到之前的答案。



## 代码



```cpp

#include<bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 10005;

int n, m, a[105][105], mp[105][105];

int s, t, idx, dis[maxn], cur[maxn], vis[maxn << 1], tag[maxn << 2];

struct edge {

    int u, v, r;

} e[maxn << 2]; 

vector <int> G[maxn];

inline void add_edge(int u, int v, int c) {

    G[u].push_back(idx);

    e[idx++] = edge{u, v, c};

    G[v].push_back(idx);

    e[idx++] = edge{v, u, 0};

    return;

} 

bool spfa() {

    list <int> que;

    memset(dis, 0x3f, sizeof dis);

    dis[s] = 0; que.push_back(s);

    while (que.size()) {

        int u = que.front();

        que.pop_front();

        if (u == t) return true;

        for (auto g : G[u]) {

            if (!e[g].r) continue;

            int v = e[g].v;

            if (dis[v] > dis[u] + 1) {

                dis[v] = dis[u] + 1;

                que.push_back(v);

            }

        }

    } 

	return false;

}

int dfs(int u, int lim) {

    if (u == t || !lim) return lim;

    int flow = 0;

    for (int &j = cur[u]; j < G[u].size(); j++) {

        int g = G[u][j], v = e[g].v, r = e[g].r;

        if (dis[u] + 1 != dis[v]) continue;

        int dlt = dfs(v, min(lim - flow, r));

        flow += dlt, e[g].r -= dlt, e[g ^ 1].r += dlt;

        if (flow == lim) break;

    } 

	return flow;

}

signed main() {

    ios::sync_with_stdio(0);

    cin.tie(0); cout.tie(0);

    cin >> n >> m, s = 0, t = n << 1 | 1;

    for (int i = 1; i <= n; i++) {

    	for (int j = 1; j <= m; j++) {

    		cin >> a[i][j];

    		add_edge(i, a[i][j] + n, 1);

		}

	}

	for (int i = 1; i <= n; i++) {

		add_edge(s, i, 1);

		add_edge(i + n, t, 1);

	}

	for (int j = 1; j <= m; j++) {

		int flow = 0;

		memset(dis, 0, sizeof dis);

		memset(vis, 0, sizeof vis);

		while (spfa()) {

			memset(cur, 0, sizeof cur);

			flow += dfs(s, 1e18);

		}

		if (flow != n) {

			cout << "No\n";

			return 0;

		}

		for (int i = 0; i < n * m * 2; i += 2) {

			if (tag[i]) continue;

			if (!e[i].r) {

				mp[e[i].u][j] = e[i].v - n, tag[i] = true;

				e[i].r = e[i ^ 1].r = 0;

			} else e[i].r = 1, e[i ^ 1].r = 0;

		}

		for (int i = n * m * 2; i < idx; i += 2) {

			e[i].r = 1, e[i ^ 1].r = 0;

		}

	}

	cout << "Yes\n";

	for (int i = 1; i <= n; i++) {

		for (int j = 1; j <= m; j++) {

			cout << mp[i][j] << ' ';

		}

		cout << '\n';

	}

    return 0;

}

```

