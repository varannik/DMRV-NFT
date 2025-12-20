# `services/mrv-engine/`

MRV computation engine (methodology logic).

Responsibilities:
- Apply methodology calculations (baseline/leakage/buffer)
- Produce computed MRV results and emit `mrv.computed.v1`
- Remain stateless where possible (pure compute + read inputs)


