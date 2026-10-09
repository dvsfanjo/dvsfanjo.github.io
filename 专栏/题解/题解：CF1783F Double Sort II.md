## 思路



首先考虑只有一个数组怎么做，自然想到可以将 $i$ 到 $a_i$ 连边，于是建出由若干个环组成的图，每次操作相当于把一个点从一个环中取出，因此每个环最多可以留下一个数不操作，答案则为数组长度减去环的个数。



现在考虑两个数组的做法。要让两个数组同时有序，要选出尽量多不操作的位置，而任意两个选出的位置不会同时属于 $a$ 或 $b$ 中的一个环，于是设第 $i$ 给位置在 $a$ 中的环为 $A_x$，在 $b$ 中的环为 $B_y$，由 $A_x$ 向 $B_y$ 连边，最后在这个二分图上匹配，匹配了的边就是不操作的位置，保证了选出的位置尽量多，剩下的就是操作的位置，按顺序输出即可。



这里我是用的是网络流跑二分图，最后统计答案时的答案便是数组长度减去最大流量，而遍历每一条正向边，若流量非 $0$ 则未被匹配，这条边就是答案，每条边顺便记录是哪个位置产生的，实现会更方便。



## 代码



```cpp

#include<bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 1e4 + 5;

int len, n, m, tot, a[maxn], b[maxn], acol[maxn], bcol[maxn], tag[maxn];

namespace Graph {

	int idx, s, t, dis[maxn], cur[maxn], vis[maxn << 1];

	struct edge {

	    int u, v, r, id;

	} e[maxn << 2]; 

	vector <int> G[maxn];

	inline void add_edge(int u, int v, int c, int id) {

	    G[u].push_back(idx);

	    e[idx++] = edge{u, v, c, id};

	    G[v].push_back(idx);

	    e[idx++] = edge{v, u, 0, id};

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

	void build() {

		s = n + m + 1, t = n + m + 2;

		for (int i = 1; i <= len; i++) add_edge(acol[i], bcol[i] + n, 1, i);

		for (int i = 1; i <= n; i++) add_edge(s, i, 1, 0);

		for (int i = 1; i <= m; i++) add_edge(i + n, t, 1, 0);

	}

	void solve() {

		int flow = 0, cnt = 0;

	    while (spfa()) {

	        memset(cur, 0, sizeof cur);

	        flow += dfs(s, 1e18);

	    } 

		cout << len - flow << '\n';

		for (int i = 0; i < idx; i += 2) {

			int u = e[i].u, v = e[i].v, r = e[i].r, id = e[i].id;

			if (1 <= u && u <= n && n + 1 <= v && v <= n + m && r) tag[id] = true; 

		}

		for (int i = 1; i <= len; i++) if (tag[i]) cout << i << ' ';

	}

};

int color(int *x, int *xcol) {

	vector <vector <int>> G(len + 1);

	vector <bool> vis(len + 1, false);

	for (int i = 1; i <= len; i++) {

		G[i].push_back(x[i]);

		G[x[i]].push_back(i);

	}

	int C = 0;

	auto dfs = [&](auto &&self, int u, int col) -> void{

		if (vis[u]) return;

		vis[u] = true, xcol[u] = col;

		for (auto g : G[u]) self(self, g, col);

	};

	for (int i = 1; i <= len; i++) {

		if (vis[i]) continue;

		dfs(dfs, i, ++C);

	}

	return C;

}

signed main() {

    ios::sync_with_stdio(0);

    cin.tie(0); cout.tie(0);

    cin >> len;

    for (int i = 1; i <= len; i++) cin >> a[i];

	for (int i = 1; i <= len; i++) cin >> b[i];

	n = color(a, acol), m = color(b, bcol);

	Graph::build(), Graph::solve();

    return 0;

}

```

