## 思路



自然的想到若 $a_i$ 二进制下第 $j$ 位为 $1$ 则由 $i$ 向 $j$ 连边，形成一个二分图，答案应是一个匹配，设所选点集为 $S$ 则答案为 $\max(|S| - |N(S)|)$ 其中 $N(S)$ 代表 $S$ 的邻域。



考虑这个东西是什么，其实就是对于一个左侧点集 $S$ 只能匹配 $N(S)$ 个结点，要求最大的失配数，则答案应该是整个二分图的最大独立集，用网络流建图后的最小割，即左侧总点数减去总流量。



## 代码



```cpp

#include<bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 10005;

int T, n, a[105], s, t, idx, dis[maxn], cur[maxn], vis[maxn << 1];

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

void solve() {

	cin >> n; s = 0, t = n + 61, idx = 0;

	for (int i = 0; i <= n + 61; i++) G[i].clear();

	for (int i = 1; i <= n; i++) {

		cin >> a[i];

		for (int j = 0; j < 60; j++) {

			if (a[i] & (1ll << j)) {

				add_edge(i, j + n + 1, 1);

				//cout << i << ' ' << j << ' ' << idx << '\n';

			}

		}

	}

	for (int i = 1; i <= n; i++) add_edge(s, i, 1);

	for (int i = 1; i <= 60; i++) add_edge(i + n, t, 1);

	memset(dis, 0, sizeof dis);

	memset(vis, 0, sizeof vis);

	int flow = 0;

	while (spfa()) {

		memset(cur, 0, sizeof cur);

		flow += dfs(s, 1e18);

	}

	cout << n - flow << '\n';

	return;

}

signed main() {

    ios::sync_with_stdio(0);

    cin.tie(0); cout.tie(0);

    cin >> T; while (T--) solve();

    return 0;

}

```

