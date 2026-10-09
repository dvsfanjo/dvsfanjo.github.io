## 题意



给定长为 $m$ 的全都是 $0$ 的序列和 $n$ 个颜色段覆盖操作 $upd_i$ ，每次**独立**的询问进行操作 $upd_l$ 到 $upd_r$ 后序列元素和是多少。



## 思路



如果每个询问都一个一个做的话会超时，因此我们要使用不同询问中的重复信息。



因此，我们先把 $n$ 个操作都做一次，在对每个答案做修正。



把玩一下样例：





```

0: 0 0 0 0 0 sum:0

1: 3 3 3 3 0 sum:12

2: 3 1 1 3 0 sum:8

3: 3 1 1 3 2 sum:10

4: +4 4 1 3 2 sum:14

```



如果我们只要做 $upd_2$ 和 $upd_3$ ，我们将 $sum3-sum1$ 再加上已经被覆盖过的 $c[2]+c[3]$ 就可以得到 $10 - 12 + 6 = 4$ ，这就是正确答案。



同理，我们要做 $upd_l$ 到 $upd_r$ 的话，我们将想前缀和一样让 $sum[r] - sum[l-1]$ 再加上被覆盖区间的数即可。



## 做法



很容易想到，区间颜色段覆盖使用珂朵莉树，维护各个时间戳的 $sum$ 使用树状数组。



这里的 ODT 要存区间覆盖时间，以便在区间推平时用树状数组记录全局和。



## 代码



马蜂良好且端正。



```cpp

#include <bits/stdc++.h>

using namespace std;

using ll = long long;

using pll = pair <ll, ll>;

#define fi first

#define se second

const int maxn = 5e5 + 5;

ll n, m, q, l, r, t[maxn], res[maxn];

vector <pll> qry[maxn];

struct update {

	ll l, r, x;

	inline void read() {

		cin >> l >> r >> x;

		return;

	}

} upd[maxn];

struct odt {

	ll l, r, t; mutable ll x;

	friend bool operator < (odt a, odt b) {

		return a.l < b.l;

	}

}; set <odt> s;

void add(ll x, ll y) {

	if (x) for (; x <= n; x += x & -x) t[x] += y;

}

ll sum(ll x, ll y = 0) {

	for (; x; x -= x & -x) y += t[x]; return y;

}

using iter = set <odt>::iterator;

iter split(ll pos) {

	iter it = s.lower_bound({pos, 0, 0, 0});

	if (it != s.end() && it->l == pos) return it;

	it--; if (it->r < pos) return s.end();

	ll l = it->l, r = it->r, t = it->t, x = it->x;

	s.erase(it); s.insert(odt{l, pos - 1, t, x});

	return s.insert(odt{pos, r, t, x}).first; 

}

void assign(ll l, ll r, ll t, ll x) {

	iter R = split(r + 1), L = split(l);

	for (iter it = L; it != R; it++) {

		add(it->t, -it->x * (it->r - it->l + 1));

	} s.erase(L, R); s.insert(odt{l, r, t, x});

	add(t, (r - l + 1) *  x); return;

}

int main() {

	ios::sync_with_stdio(0);

	cin.tie(0); cout.tie(0);

	cin >> n >> m >> q; s.insert(odt{1, m, 0, 0});

	for (int i = 1; i <= n; i++) {

		upd[i].read();

	} 

	for (int i = 1; i <= q; i++) {

		cin >> l >> r;

		qry[r].push_back({l, i});

	}

	for (int i = 1; i <= n; i++) {

		assign(upd[i].l, upd[i].r, i, upd[i].x);

		for (auto l : qry[i]) {

			res[l.se] = sum(i) - sum(l.fi - 1);

		}

	}

	for (int i = 1; i <= q; i++) {

		cout << res[i] << '\n';

	}

	return 0;

}

```



