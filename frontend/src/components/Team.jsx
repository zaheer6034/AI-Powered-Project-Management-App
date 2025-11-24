import React from 'react';

function Team({ members = [], tasks = [] }) {

    const getMemberStats = (memberId) => {
        const memberTasks = tasks.filter(t => t.assignees && t.assignees.includes(memberId));
        const active = memberTasks.filter(t => !t.completed).length;
        const completed = memberTasks.filter(t => t.completed).length;
        return { total: memberTasks.length, active, completed };
    };

    // Calculate max tasks for chart scaling
    const maxTasks = Math.max(...members.map(m => getMemberStats(m.id).active), 1);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: 'white' }}>Team Overview</h2>
                <button className="btn btn-primary">Invite Member</button>
            </div>

            {/* Workload Distribution Chart */}
            <div className="add-task-card" style={{ marginBottom: '32px' }}>
                <h3 style={{ margin: '0 0 24px 0', color: 'white' }}>Workload Distribution</h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    height: '200px',
                    gap: '16px',
                    padding: '0 16px 24px 16px',
                    borderBottom: '1px solid var(--border-subtle)'
                }}>
                    {members.map(member => {
                        const stats = getMemberStats(member.id);
                        const heightPercentage = (stats.active / maxTasks) * 100;
                        return (
                            <div key={member.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '100%',
                                    maxWidth: '40px',
                                    height: `${Math.max(heightPercentage, 5)}%`,
                                    background: member.color,
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'height 0.5s ease',
                                    position: 'relative',
                                    opacity: 0.8
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-24px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        {stats.active}
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                    {member.name.split(' ')[0]}
                                </div>
                            </div>
                        );
                    })}
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
