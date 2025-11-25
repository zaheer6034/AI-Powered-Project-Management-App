import React from 'react';

function Team({ members = [], tasks = [] }) {

    const getMemberStats = (memberId) => {
        const memberTasks = tasks.filter(t => t.assignees && t.assignees.includes(memberId));
        const active = memberTasks.filter(t => !t.completed).length;
        const completed = memberTasks.filter(t => t.completed).length;
        return { total: memberTasks.length, active, completed };
    };

    // Prepare data for the chart
    const chartData = members.map((member, index) => {
        const stats = getMemberStats(member.id);
        return {
            ...member,
            stats,
            value: stats.active
        };
    });

    const maxValue = Math.max(...chartData.map(d => d.value), 5); // Minimum max of 5 for scale
    const chartHeight = 200;
    const chartWidth = 800; // Internal SVG coordinate width
    const padding = 40;
    const availableWidth = chartWidth - (padding * 2);
    const availableHeight = chartHeight - (padding * 2);

    // Calculate points
    const points = chartData.map((data, index) => {
        const x = padding + (index * (availableWidth / (chartData.length - 1 || 1)));
        const y = chartHeight - padding - ((data.value / maxValue) * availableHeight);
        return { x, y, ...data };
    });

    // Generate path string
    const pathData = points.length > 1
        ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
        : `M ${padding},${chartHeight - padding} L ${chartWidth - padding},${chartHeight - padding}`; // Fallback for single point

    // Generate area fill path (close the loop to the bottom)
    const areaPathData = points.length > 1
        ? `${pathData} L ${points[points.length - 1].x},${chartHeight - padding} L ${points[0].x},${chartHeight - padding} Z`
        : '';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: 'white' }}>Team Overview</h2>
                <button className="btn btn-primary">Invite Member</button>
            </div>

            {/* Workload Distribution Line Chart */}
            <div className="add-task-card" style={{ marginBottom: '32px' }}>
                <h3 style={{ margin: '0 0 24px 0', color: 'white' }}>Workload Distribution</h3>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', minWidth: '600px' }}>
                        {/* Grid Lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                            const y = chartHeight - padding - (ratio * availableHeight);
                            return (
                                <g key={ratio}>
                                    <line
                                        x1={padding}
                                        y1={y}
                                        x2={chartWidth - padding}
                                        y2={y}
                                        stroke="var(--border-subtle)"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                    />
                                    <text
                                        x={padding - 10}
                                        y={y + 4}
                                        fill="var(--text-muted)"
                                        fontSize="10"
                                        textAnchor="end"
                                    >
                                        {Math.round(ratio * maxValue)}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area Fill */}
                        <path d={areaPathData} fill="rgba(59, 130, 246, 0.1)" />

                        {/* Line */}
                        <path
                            d={pathData}
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data Points and Labels */}
                        {points.map((point, i) => (
                            <g key={point.id}>
                                {/* Vertical Line to X-axis (optional, for better readability) */}
                                <line
                                    x1={point.x}
                                    y1={point.y}
                                    x2={point.x}
                                    y2={chartHeight - padding}
                                    stroke="var(--border-subtle)"
                                    strokeWidth="1"
                                    opacity="0.3"
                                />

                                {/* Point Circle */}
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="6"
                                    fill="var(--bg-card)"
                                    stroke={point.color}
                                    strokeWidth="3"
                                />

                                {/* Value Label */}
                                <text
                                    x={point.x}
                                    y={point.y - 15}
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {point.value}
                                </text>

                                {/* X-axis Label (Name) */}
                                <text
                                    x={point.x}
                                    y={chartHeight - 10}
                                    fill="var(--text-muted)"
                                    fontSize="12"
                                    textAnchor="middle"
                                >
                                    {point.name.split(' ')[0]}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            <h3 style={{ color: 'white', marginBottom: '16px' }}>Team Members</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {members.map(member => {
                    const stats = getMemberStats(member.id);
                    return (
                        <div key={member.id} className="add-task-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    background: member.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: '20px'
                                }}>
                                    {member.avatar}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'white', fontSize: '16px' }}>{member.name}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{member.role}</div>
                                    <div style={{
                                        fontSize: '12px',
                                        marginTop: '4px',
                                        color: member.status === 'online' ? 'var(--primary)' : member.status === 'busy' ? 'var(--warning)' : 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                        {member.status}
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-around' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{stats.active}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Tasks</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.completed}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-accent)' }}>{stats.total}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Assigned</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Team;
