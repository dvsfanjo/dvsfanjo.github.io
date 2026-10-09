## 李超线段树



### 简介



李超线段树是用来维护上凸包、下凸包的数据结构，因此在斜率优化的题目中十分常见；具体地说，可以插入一条线段并查询单点最值。



介绍它之前，请了解：



- 直线的方程（或者说一次函数）

- 线段树标记永久化



## 流程



线段树的节点用来维护一个区间信息，李超线段树维护的就是一个区间上 **值最大的线段编号的懒标记**。



难以理解的内容就要看图。



![](https://oi-wiki.org/ds/images/li-chao-tree-1.png)



这是 oi-wiki 上的图，新插入的线段和原标记的线段只会在左右两区间中的一个相交，我们将当前区间的标记定为值最大的那一条线段，另一条线段当作标记在相交的区间下传。



如何判断那一条线段最值最大呢，看区间中点在两条线段的取值那个更大即可。



显然，在指定线段树某个节点进行上述操作的 $O(\log n)$ 的，因为只会递归左或右区间，然而题目每次插入限定了区间，我们又要将其划分为线段树上至多 $\log n$ 个节点，对每个结点进行上述操作，总共 $n$ 次修改，总时间复杂度为 $O(n\log^2n)$。



### 代码细节



- 可能会有垂直于 $x$ 轴的线段，斜率不存在，于是我们查询函数值时返回两个端点的最大纵坐标即可，具体看代码细节。

- 横纵坐标模数不一样

- 浮点数不能直接比大小



## 代码



```cpp

#include <bits/stdc++.h>

using namespace std;

using ll = long long;

const int maxn = 1e5 + 5;

double a1, b1, a2, b2, k[maxn], b[maxn];

ll n, lstans, tot, op, t[maxn << 2];

inline double val(ll i, double x) { //单点函数值 

	if (i) return k[i] * x + b[i];

	return -1e18;

}

ll cmp(double a, double b) { //浮点数比大小 

	if (fabs(a - b) < 1e-8) return 0;

	if (a - b > 1e-8) return 1;

	return -1;

}

#define ls (i << 1)

#define rs (ls | 1)

#define mid (l + r >> 1)

void update1(ll l, ll r, ll i, ll k) {

	ll c = cmp(val(k, mid), val(t[i], mid));

	if (c == 1 || (!c && k < t[i])) swap(t[i], k); //让节点标记为大的函数，另一条变为 k 下传 

	ll cl = cmp(val(k, l), val(t[i], l));

	ll cr = cmp(val(k, r), val(t[i], r));

	if (cl == 1 || (!cl && k < t[i])) update1(l, mid, ls, k);

	if (cr == 1 || (!cr && k < t[i])) update1(mid + 1, r, rs, k);

	return;

}

void update2(ll l, ll r, ll i, ll a, ll b, ll k) {

	if (a <= l && r <= b) {

		update1(l, r, i, k); //分成小区间 

	} else {

		if (a <= mid) update2(l, mid, ls, a, b, k);

		if (mid < b) update2(mid + 1, r, rs, a, b, k);

	} return;

}

ll query(ll l, ll r, ll i, ll pos) {

	if (l == r) {

		return t[i];

	} else {

		ll ans = t[i];

		if (pos <= mid) {

			ll q = query(l, mid, ls, pos);

			if (cmp(val(q, pos), val(ans, pos)) > 0 ||

			    (!cmp(val(q, pos), val(ans, pos)) && q < ans)) { //值相等要返回编号最小的 

				ans = q;

			} 

		} else {

			ll q = query(mid + 1, r, rs, pos);

			if (cmp(val(q, pos), val(ans, pos)) > 0 ||

			    (!cmp(val(q, pos), val(ans, pos)) && q < ans)) {

				ans = q;

			}

		}

		return ans;

	}

}

int main() {

	ios::sync_with_stdio(0);

	cin.tie(0); cout.tie(0);

	cin >> n; while (n--) {

		cin >> op;

		if (op) {

			cin >> a1 >> b1 >> a2 >> b2;

			a1 = ll(a1 + lstans - 1) % 39989 + 1;

			b1 = ll(b1 + lstans - 1) % 1000000000 + 1;

			a2 = ll(a2 + lstans - 1) % 39989 + 1;

			b2 = ll(b2 + lstans - 1) % 1000000000 + 1; //要模 1e9 而不是 39989 

			if (cmp(a1, a2)) k[++tot] = (b1 - b2) / (a1 - a2), b[tot] = b1 - a1 * k[tot];

			else b[++tot] = max(b1, b2); //斜率不存在，直接将斜率当作 0, 带入 val 函数会返回 b ，将 b 设为纵坐标最大值即可 

			if (cmp(a1, a2) > 0) swap(a1, a2);

			update2(1, 39989, 1, a1, a2, tot);

		} else {

			cin >> a1; a1 = ll(a1 + lstans - 1) % 39989 + 1;

			lstans = query(1, 39989, 1, a1);

			cout << lstans << '\n';

		}

	}

	return 0;

}

```

