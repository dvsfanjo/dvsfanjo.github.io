## 思路



每次修改看作在一个可持久化数组上的修改，每个序列相当于这个可持久化数组的某一个版本。



1. 操作一：直接将 $A_x$ 对应的版本号改成 $A_y$ 的版本号。

2. 操作二：在 $A_x$ 的版本上新建一个修改后的版本，并将 $A_x$ 的版本号更新。

3. 操作三：直接在对应的版本中查询区间和。



使第零个版本初始化为全是 $0$ 的序列，没了。



## 赛时代码



```cpp

#include <bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 2e5 + 5;

int n, m, q, op, a, b, c, idx, tot, rt[maxn], ver[maxn];

struct node {

	int sum, ls, rs;

} t[maxn * 100];

#define mid (l + r >> 1)

int update(int u, int l, int r, int pos, int val) {

	int i = ++idx;

	t[i] = t[u];

	if (l == r) {

		t[i].sum = val;

	} else {

		if (pos <= mid) t[i].ls = update(t[u].ls, l, mid, pos, val);

		else t[i].rs = update(t[u].rs, mid + 1, r, pos, val);

		t[i].sum = t[t[i].ls].sum + t[t[i].rs].sum;

	}

	return i;

}

int query(int u, int l, int r, int a, int b) {

	if (a <= l && r <= b) return t[u].sum;

	int ans = 0;

	if (a <= mid && t[u].ls) ans += query(t[u].ls, l, mid, a, b);

	if (mid < b && t[u].rs) ans += query(t[u].rs, mid + 1, r, a, b);

	return ans;

}

int build(int l, int r) {

	int i = ++idx;

	if (l == r) {

		t[i].sum = 0;

	} else {

		t[i].ls = build(l, mid);

		t[i].rs = build(mid + 1, r);

		t[i].sum = 0;

	}

	return i;

}

signed main() {

    ios::sync_with_stdio(0);

    cin.tie(0); cout.tie(0);

    cin >> n >> m >> q;

    rt[0] = build(1, m);

    //没有这个 build 会导致 idx 有误

    while (q--) {

    	cin >> op >> a >> b;

    	if (op == 1) {

    		ver[a] = ver[b];

		}

		if (op == 2) {

			cin >> c;

			rt[++tot] = update(rt[ver[a]], 1, m, b, c);

			ver[a] = tot;

		}

		if (op == 3) {

			cin >> c;

			cout << query(rt[ver[a]], 1, m, b, c) << '\n';

		}

	}

    return 0; 

}

```



[通过记录](https://atcoder.jp/contests/abc453/submissions/74892756)

