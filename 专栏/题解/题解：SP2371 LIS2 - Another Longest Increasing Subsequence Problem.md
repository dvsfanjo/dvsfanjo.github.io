## 题目概述



有 $n$ 个三维数点 $(i,x,y)$，问取多少个点使得任意两点 $A$ 和 $B$ 都有：



$A_i<B_i$



$A_x<B_x$



$A_y<B_y$



## 思路



三维偏序问题，一眼 CDQ 分治套 DP 。



定义 $f_i$ 为前 $i$ 个坐标的 LIS ，那么有：



$f_i=\max{f_j} + 1$



分治 $x$ 维的前一半后，将前一半的 $f_i$ 以 $y$ 维为下标塞到树状数组里面，最后通过前缀最大值得到答案。



注意分治顺序，先分治 $[l,mid]$，在处理 $[l,r]$，最后分治 $[mid+1,r]$。



## 代码



```cpp

#include<bits/stdc++.h>

using namespace std;

using ll = long long;

const int maxn = 1e5 + 5;

ll n, m, f[maxn], x[maxn], y[maxn], lsh[maxn], t[maxn];

inline ll find(ll x) {

    return lower_bound(lsh + 1, lsh + m + 1, x) - lsh;

}

bool cmp(ll i, ll j) {

    return x[i] < x[j];

}

void update(ll pos, ll x) {

    for (; pos <= m; pos += pos & -pos) t[pos] = max(t[pos], x);

}

ll query(ll pos, ll res = -1e18) {

    for (; pos; pos -= pos & -pos) res = max(res, t[pos]);

    return res;

}

void recover(ll pos) {

    for (; pos <= m; pos += pos & -pos) t[pos] = 0;

}

void cdq(ll l, ll r) {

    if (l == r) return;

    ll mid = (l + r) >> 1;

    cdq(l, mid);

    vector <ll> L, R;

    for (int i = l; i <= mid; i++) L.push_back(i);

    for (int i = mid + 1; i <= r; i++) R.push_back(i);

    sort(L.begin(), L.end(), cmp);

    sort(R.begin(), R.end(), cmp);

    ll j = 0;

    for (auto i : R) {

        while (j < L.size() && x[L[j]] < x[i]) {

            update(y[L[j]], f[L[j]]); j++;

        } f[i] = max(f[i], query(y[i] - 1) + 1);

    } while (--j >= 0) recover(y[L[j]]);

    cdq(mid + 1, r);

    return;

}

int main() {

    ios::sync_with_stdio(0);

    cin.tie(0); cout.tie(0);

    cin >> n;

    for (int i = 1; i <= n; i++) {

        cin >> x[i] >> y[i];

        lsh[i] = y[i]; f[i] = 1;

    } sort(lsh + 1, lsh + n + 1);

    m = unique(lsh + 1, lsh + n + 1) - lsh - 1;

    for (int i = 1; i <= n; i++) {

        y[i] = find(y[i]);

    }

    cdq(1, n); ll res = -1;

    for (int i = 1; i <= n; i++) {

        res = max(res, f[i]);

    } cout << res << '\n';

    return 0;

}

```

